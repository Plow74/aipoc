import os
import openai
import dotenv
import json
import requests
from langchain.chat_models import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate
from json_converter.json_mapper import JsonMapper
from flask import Flask
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.text_splitter import CharacterTextSplitter
from langchain.schema.document import Document
from langchain_openai import AzureOpenAIEmbeddings
from langchain_openai import AzureChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.schema import StrOutputParser


AZURE_OPENAI_DEPLOYMENT = "gpt-35-turbo-16k"

app = Flask(__name__)
dotenv.load_dotenv()

def similarity_score(jira_description, original_question):
    url = "https://oai-use-arch.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15"
    headers = {
        "Content-Type": "application/json",
        "api-key": "15c7d99d45964a89ab980cd571b79a3c"
    }

    jira_description_escaped = escape_special_characters(jira_description)
    original_question_escaped = escape_special_characters(original_question)

    data = {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that determines if a Jira ticket can be used as a reference for the original question."},
            {"role": "user", "content": f"Jira Description: {jira_description_escaped}  Original question: {original_question_escaped}"[
                :3500]},
            {"role": "user", "content": "Does the Jira ticket description match the original question?  If so, tell us how confident you are in the form of a percentage."}
        ],
        "model": "gpt-3.5-turbo-16k",
        "max_tokens": 100
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))
    return response.json()

def escape_special_characters(text):
    return text.replace("{", "{{").replace("}", "}}").replace('"', r'\"')

def get_jira_responses(keywords):
    # form like:
    # { uri: "", id: "", responseText: ""}

    dotenv.load_dotenv()

    keywordsJson = json.loads(keywords)

    # TODO loop to create a JQL "ANDed" query
    # logger.warn("the keywords...")
    predicate = ""
    keywordCount = 0
    for keyword in keywordsJson['keyword_phrases']:
        if keywordCount == 0:
            predicate += ("description ~ '" + keyword + "'")
        else:
            predicate += (" and description ~ '" + keyword + "'")
        # logger.warn(predicate)
        keywordCount += 1
    
    # jql = "description ~ '" + keywordsJson['keyword_phrases'][0] + "'"
    # jql = "description ~ '" + predicate + "'"

    # jira_url = os.getenv("JIRA_API_ENDPOINT") + "?jql=" + predicate
    jira_url = os.getenv("JIRA_BASE_URL") + "/rest/api/2/search?jql=" + predicate

    headers = {"Content-Type": "application/json",
               "Authorization": "Bearer " + os.getenv("JIRA_AUTH_TOKEN")}

    app.logger.warn('jira_url in get_jira_responses:')
    app.logger.warn(jira_url)

    app.logger.warn('response:')
    response = requests.get(jira_url, headers=headers)
    app.logger.warn(response)

    json_content = response.json()
    
    # convert the json
    app.logger.warn('mapping to new json...')
    toMap =     {
        '$on': 'issues',
        'theId': ['id'],
        'theKey': ['key'],
        'theAnswer': ['fields.customfield_11302']
    }

    newJson = JsonMapper(json_content).map(toMap)
    app.logger.warn(newJson);    
    
    # return json_content
    return newJson

def get_tokens_from_question(question):
    print('get_tokens_from_question 1')
    dotenv.load_dotenv()
    print('get_tokens_from_question 2')

    template_text = '''You are an experienced data analyst and public health policy expert with expertise in Jira Query Language. You are reviewing questions submitted by the public regarding information about a new regulation. Your task is to analyze the submitted question and generate a list of keyword phrases to be used in a Jira search for matching tickets. This will help program administrators to quickly find responses that were given for previously answered questions similar in nature. 
    You should follow these steps: 
    1) Read the PUBLIC_QUESTION
    2) Determine which keyword phrases would be most-helpful in finding a ticket in Jira that matches this question.
    3) Return the top-5 keyword phrases in JSON format, where a keyword is a word or phrase from the log message that might also be found in a Jira message that is similar to the provided log text.
    
    OUTPUT:
    The output should be a JSON formatted list of keyword phrases, sorted by the most-likely match in a Jira ticket. Please return the key phrases as JSON data.
    
    Identify key phrases from the following public question and return them in a JSON object: {log}'''

    print('get_data_from_log 3')

    prompt = ChatPromptTemplate.from_template(template_text)
    model = AzureChatOpenAI(
        openai_api_version="2023-05-15",
        azure_deployment=AZURE_OPENAI_DEPLOYMENT,
    )
    chain = prompt | model
    chain_response = chain.invoke({"log": question})

    return chain_response.content

def populate_answer_from_acs(question, answerJson, azureSource):
# this is new code...
    if azureSource == "CCG":
        indexName = "fedindex1-index"
    else:
        indexName = "fedindex2-index"
        
    client = get_openai_client()

    completion = client.chat.completions.create(
        model=AZURE_OPENAI_DEPLOYMENT,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant aiding healthcare IT vendors find information on certification.",
            },
            {
                "role": "user",
                "content": question + " In addition to providing the response, please include a response labeled 'confidence score' indicating how confident you are in the form of a percentage.",
            },
        ],
        extra_body={
            "dataSources": [
                {
                    "type": "AzureCognitiveSearch",
                    "parameters": {
                        "endpoint": "https://fedaisearchservice.search.windows.net",
                        "key": os.getenv("SEARCH_KEY"),
                        "indexName": indexName
                    }
                }
            ]
        }
    )

    openAiResponse = json.loads(completion.json())

    sampleResponse = {
        "source": azureSource,
        "score": 0,
        "response": "",
        "url": ""
        }

    # score
    score = get_score(openAiResponse["choices"][0]["message"]["content"])
    
    sampleResponse["response"] = openAiResponse["choices"][0]["message"]["content"]
    sampleResponse["score"] = score
    contentJson = json.loads(openAiResponse["choices"][0]["message"]["context"]["messages"][0]["content"])
    sampleResponse["url"] = contentJson["citations"][0]["url"]

    answerJson["responses"].append(sampleResponse)     
    
def populate_answer_from_jira(question, answerJson):
    app.logger.warn('answerJson 1')
    app.logger.warn(answerJson)
    
    tokensFromQuestion = get_tokens_from_question(question)
    # print("Tokens from question: ")
    # print(tokensFromQuestion)
    
    jiraResponses = get_jira_responses(tokensFromQuestion)
    
    counter = 0
    for jiraResponse in jiraResponses:
        sampleResponse = {
            "source": "JIRA",
            "score": 0,
            "response": "Response will be here.",
            "url": "URL will be here"
        }
        
        counter += 1
        sampleResponse['response'] = jiraResponse['theAnswer']
        sampleResponse['url'] = os.getenv("JIRA_BASE_URL") + "/browse/" + jiraResponse['theKey']
        
        # Get sample similarity score
        similarityScore = similarity_score(jiraResponse['theAnswer'], question)
        
        # score
        sampleResponse['score'] = get_score(similarityScore["choices"][0]["message"]["content"])
                   
        answerJson["responses"].append(sampleResponse)
        app.logger.warn('jira response')
        app.logger.warn(jiraResponse)

        
    app.logger.warn('answerJson 2')
    app.logger.warn(answerJson)
        
def get_score(source):
    score = 0
    endPos = source.find("%")
    startPos = endPos
    while startPos > 0 and source[startPos] != ' ':
        startPos -= 1
    if startPos > 0:
        score = source[startPos:endPos]
    
    return score

def get_openai_client():
    endpoint = "https://oai-use-arch.openai.azure.com/"
    api_key = os.getenv("AZURE_OPENAI_API_KEY")

    client = openai.AzureOpenAI(
        base_url=f"{endpoint}/openai/deployments/{AZURE_OPENAI_DEPLOYMENT}/extensions",
        api_key=api_key,
        api_version="2023-08-01-preview",
    )

    return client
    
def get_combined_answer(responses):
    print("\n\nIn get_combined_answer\n\n")
       
    allResponses = "" 
    # allResponses = responses["selectedResponses"][0]
    
    for response in responses["selectedResponses"]:
        allResponses += (response + "\n")
        
    vectorstore = FAISS.from_texts(
        [allResponses], embedding=AzureOpenAIEmbeddings()
    )
    
    retriever = vectorstore.as_retriever()

    prompt = PromptTemplate(input_variables=['context', 'question'], template="You are an AI model tasked with providing informed responses to public inquiries based on provided contextual information. A public user has submitted a question, and your role is to analyze this question in light of the related texts provided and generate a detailed answer. Contextual Information (Related Texts): {context}\nPublic User's Question: {question}\nBased on the information provided in the related texts, formulate a comprehensive and informed response to the public user's question. Your response should integrate and reflect the insights and data present in the related texts to ensure accuracy and relevance.  Output for this response should include hypertext links to relevant resources where applicable and inserted inline with the response.")

    llm = AzureChatOpenAI(
            openai_api_version="2023-05-15",
            azure_deployment="gpt-35-turbo-16k",
        )

    rag_chain = (
        {"context": retriever , "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    # return json.dumps(rag_chain.invoke("How many times does a QMS need to be identified?"))
    return json.dumps(rag_chain.invoke(responses["question"]))
              
    # return """This is the combined answer!"""
    
def get_answer(question):
    print("\n\nIn get_answer\n\n")
    responseJson = {
        "suggestedResponse": "",
    "responses": [
    ]
    }

    try:
        populate_answer_from_acs(question, responseJson, "CCG")
        populate_answer_from_acs(question, responseJson, "HTI Final Rule")
        populate_answer_from_jira(question, responseJson)

        # Populate our suggested response
        suggestedResponse = ""
        suggestedResponseScore = 0
        generatedId = 0
        for jiraResponse in responseJson["responses"]:
            jiraResponse["id"] = generatedId
            generatedId += 1
            responseScore = int(jiraResponse["score"])
            if responseScore > suggestedResponseScore:
                suggestedResponseScore = responseScore
                suggestedResponse = jiraResponse["response"]

        responseJson["suggestedResponse"] = suggestedResponse
        print("\n\nSample API Response\n\n")
        print(responseJson)

        return responseJson
    except Exception as error:
        responseJson = {
            "suggestedResponse": f"There was a problem processing the request. {error}",
        "responses": [
        ]
        }        
        
        return responseJson


from flask import Flask, jsonify, request
import json
import os

from api.service import get_answer, get_combined_answer, get_tokens_from_question, get_jira_responses, similarity_score

app = Flask(__name__)


@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

# Using this endpoint for testing the solution PR


@app.route("/api/get-solution-from-PR")
def get_sol_from_pr():

    # Assumes everything before here gives me the below object as a result.
    result = [
        {
            "jira": {
                "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                "id": "695492",
                "self": "https://jira.pointclickcare.com/jira/rest/api/2/issue/695492",
                "key": "OSRS-2810",
                "fields": {
                    "summary": "Contacts - Mailing Address",
                    "description": "When a user navigates to the contacts step of the intake flow they should see:\r\n * A card for every contact associated with the user\r\n ** The card should contain live data for the contact's mailing address. This should only be visible in the expanded card state.\r\n\r\nWhen editing the contact, the user should see:\r\n * The address fields with the mailing address filled in\r\n * The fields should behave as outlined in the address reusable component's Jira\r\n\r\nWhen adding a new contact, the user should see:\r\n * A blank set of address fields\r\n * The country should be pre-filled to match the community (facility) country\r\n\r\nUX: [Figma|https://www.figma.com/file/D4ink3dK5RmVHcGKKA8jzR/Resident-Profile-%2B-Listing?type=design&node-id=4700%3A239803&t=dd2Cx19ORwqkwZXJ-1]",
                    "status": {
                        "self": "https://jira.pointclickcare.com/jira/rest/api/2/status/10106",
                        "iconUrl": "https://jira.pointclickcare.com/jira/images/icons/statuses/closed.png",
                        "name": "Done",
                        "id": "10106",
                        "statusCategory": {
                            "self": "https://jira.pointclickcare.com/jira/rest/api/2/statuscategory/3",
                            "id": 3,
                            "key": "done",
                            "colorName": "green",
                            "name": "Done"
                        }
                    }
                }
            },
            "similarityScore": 84,
            "teamsChats": []
        },
        {
            "jira": {
                "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                "id": "695493",
                "self": "https://jira.pointclickcare.com/jira/rest/api/2/issue/695493",
                "key": "OSRS-2811",
                "fields": {
                    "summary": "Contacts - Contact Relationship",
                    "description": "When a user navigates to the contacts step of the intake flow they should see:\r\n * A card for every contact associated with the user\r\n ** The card should contain live data for the contact's Contact Relationship.\r\n *** The card should continue to display non-standard relationships for existing contacts\r\n\r\nWhen editing the contact, the user should see:\r\n * The contact relationship dropdown prefilled if available\r\n ** Should a contact have a non-standard value the field should indicate that the value is deprecated.\r\n * The dropdown should allow for selection from a standard list of contact relationships.\r\n ** Should a contact have a non-standard value the dropdown should indicate that the value is deprecated.\r\n\r\nWhen adding a new contact, the user should see:\r\n * A dropdown with a standard set of contact relationships\r\n\r\nUX: [Figma|https://www.figma.com/file/D4ink3dK5RmVHcGKKA8jzR/Resident-Profile-%2B-Listing?type=design&node-id=4700%3A239803&t=dd2Cx19ORwqkwZXJ-1]",
                    "status": {
                        "self": "https://jira.pointclickcare.com/jira/rest/api/2/status/10106",
                        "description": "",
                        "iconUrl": "https://jira.pointclickcare.com/jira/images/icons/statuses/closed.png",
                        "name": "Done",
                        "id": "10106",
                        "statusCategory": {
                            "self": "https://jira.pointclickcare.com/jira/rest/api/2/statuscategory/3",
                            "id": 3,
                            "key": "done",
                            "colorName": "green",
                            "name": "Done"
                        }
                    }
                }
            },
            "similarityScore": 73,
            "teamsChats": []
        }
    ]

    for set in result:
        set["proposedSolution"] = get_solution_from_PR(set["jira"])

    return result

@app.route('/api/combine-answer', methods=['POST'])
def combine_answer():
    app.logger.warn('log entry from combine-answer')
    print("Hello from combine-answer")

    requestJson = request.get_json()
    
    return get_combined_answer(requestJson)

@app.route('/api/answer-question', methods=['POST'])
def answer_question():
    app.logger.warn('log entry from answer_question')
    print("Hello from answer_question")

    requestJson = request.get_json()
    
#    theQuestion = requestJson['log']
    
#    tokensFromQuestion = get_tokens_from_question(requestJson['log'])
#    print("Tokens from question: ")
#    print(tokensFromQuestion)
    
#    jiraResponses = get_jira_responses(tokensFromQuestion, app.logger)
#    app.logger.warn('jira responses...')
#    # app.logger.warn(jiraResponses)
    
#    # Get sample similarity score
#    app.logger.warn('getting similarity score 0')
#    similarityScore = similarity_score(jiraResponses[0]['theAnswer'], theQuestion)
#    app.logger.warn('similarity score 0:')
#    app.logger.warn(similarityScore)

#    app.logger.warn('getting similarity score 1')
#    similarityScore = similarity_score(jiraResponses[1]['theAnswer'], theQuestion)
#    app.logger.warn('similarity score 1:')
#    app.logger.warn(similarityScore)

#    app.logger.warn('getting similarity score 2')
#    similarityScore = similarity_score(jiraResponses[2]['theAnswer'], theQuestion)
#    app.logger.warn('similarity score 2:')
#    app.logger.warn(similarityScore)
    
    return get_answer(requestJson['log'])

@app.route('/api/answer-question-original', methods=['POST'])
def answer_question_original():
    app.logger.warn('log entry from answer_question')
    print("Hello from answer_question")

    responseJson = {
        "suggestedResponse": "This is the suggested response that will be presented to the user in the upper right area of the UI.",
        "responses": [
            {
                "key": "key1",
                "source": "CCG",
                "score": 95,
                "response": "This is a response from the CCG source.",
                "url": "http://sampleurl.com/blah"
            },
            {
                "key": "key2",
                "source": "JIRA",
                "score": 80,
                "response": "This is a response from the JIRA source.",
                "url": "http://sampleurl.com/blah"
            }
        ]
    }

    return responseJson



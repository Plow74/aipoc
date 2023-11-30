export async function POST(req: Request) {
  const question = await req.json();
  console.log(`DEBUG ---> question is ${question}`);

  return Response.json({
    suggestedResponse:
      "This is the suggested response that will be presented to the user in the upper right area of the UI.",
    responses: [
      {
        source: "CCG",
        score: 95,
        response: "This is a response from the CCG source.",
        url: "http://sampleurl.com/blah",
      },
      {
        source: "JIRA",
        score: 80,
        response: "This is a response from the JIRA source.",
        url: "http://sampleurl.com/blah",
      },
    ],
  });
}

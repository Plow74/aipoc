export async function POST(req: Request) {
  const question = await req.json();
  console.log(`DEBUG ---> question is ${JSON.stringify(question)}`);

  const selectedResponses = question.selectedResponses;

  return Response.json(question.selectedResponses.join("\n"));
}

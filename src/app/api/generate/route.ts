import { OpenAI } from 'openai';
import { buildCoverLetterPrompt } from "../../../utils/promptBuilder";


const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Preferred and fallback model
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-nano';
const FALLBACK_MODEL = process.env.OPENAI_MODEL_FALLBACK || 'gpt-4o-mini';


export async function POST(req: Request) {

  const { resume, job } = await req.json();
  const { system, user } = buildCoverLetterPrompt(resume, job);

  // const messages: ChatCompletionMessageParam[]= [
  // { role: "system", content: system },
  // { role: "user", content: user },  
  //   ];

  try {
    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input: [
          { role: "system", content: system },
          {
              role: "user",
              content: user,
          },
      ]
    });
    console.log("Request sent to OpenAI!");
    return new Response(JSON.stringify({ output: response.output_text }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.warn(`Fallback to ${FALLBACK_MODEL} due to error:`, err);

    // Retry with fallback model
    const retryResponse = await client.responses.create({
      model: DEFAULT_MODEL,
      input: [
          { role: "system", content: system },
          {
              role: "user",
              content: user,
          },
      ]
    });

    return new Response(JSON.stringify({ output: retryResponse.output_text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

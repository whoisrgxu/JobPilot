import { GoogleGenAI } from "@google/genai";
import { buildCoverLetterPrompt } from "../../../utils/promptBuilder";
import { checkUserUsage } from "@/middleware/checkUser";


const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });


// Preferred and fallback model
const DEFAULT_MODEL = process.env.GOOGLE_MODEL || 'gemini-2.0-flash';
const FALLBACK_MODEL = process.env.GOOGLE_MODEL_FALLBACK || 'gemini-2.0-flash-lite';


export async function POST(req: Request) {
  console.log("route entered.");
  const contentType = req.headers.get("content-type");
  console.log("headers", req.headers);
  let resume: string | Buffer;
  let job: string;
  let email: string;
  let tone: string;
  if (contentType?.includes("application/json")) {

    const data = await req.json();
    resume = data.resume;
    job = data.job;
    email = data.email;
    tone = data.tone || "Enthusiastic"; // Default tone if not provided
  } 
  else if (contentType?.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    resume = Buffer.from(arrayBuffer);    
    job = formData.get("job") as string;
    email = formData.get("email") as string;
    tone = formData.get("tone") as string || "Enthusiastic"; // Default tone if not provided
  }
  else {
    return new Response("Unsupported content type", { status: 400 });
  }
  // Check if user has exceeded usage limits
  const usageCheck = await checkUserUsage(email);
  if (!usageCheck.allowed) {
    if (usageCheck.reason === "User has not registered. Register first before use.") {
      console.warn("User has not registered. Register first before use.");
      return new Response("User has not registered. Register first before use.", { status: 403 });
    }
    console.warn("Usage limit reached. Please upgrade.");
    return new Response("Usage limit reached. Please upgrade.", { status: 403 });
  }

  const prompt = await buildCoverLetterPrompt(resume, job, tone);


  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt
    });

    return new Response(JSON.stringify({ output: response.text }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.warn(`Fallback to ${FALLBACK_MODEL} due to error:`, err);

    // Retry with fallback model
    const retryResponse = await ai.models.generateContent({
      model: FALLBACK_MODEL,
      contents: prompt
    });

    return new Response(JSON.stringify({ output: retryResponse.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

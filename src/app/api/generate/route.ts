import { GoogleGenAI } from "@google/genai";
import { buildCoverLetterPrompt } from "../../../utils/promptBuilder";
import { checkUserUsage } from "@/middleware/checkUser";
import { ratelimit } from "@/lib/rateLimiter";


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
  let industry: string;
  if (contentType?.includes("application/json")) {

    const data = await req.json();
    resume = data.resume;
    job = data.job;
    email = data.email;
    industry = data.industry || "any"; // Default industry to any if not provided
  } 
  else if (contentType?.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    resume = Buffer.from(arrayBuffer);    
    job = formData.get("job") as string;
    email = formData.get("email") as string;
    industry = formData.get("industry") as string || "Enthusiastic"; // Default industry if not provided
  }
  else {
    return new Response("Unsupported content type", { status: 400 });
  }
  // Check if user has exceeded usage limits
  const usageCheck = await checkUserUsage(email);
  if (!usageCheck.allowed) {
    if (usageCheck.reason === "User has not registered. Register first before use.") {

      return new Response(JSON.stringify({output: "User has not registered. Register first before use."}));
    }
    return new Response(JSON.stringify({output: "Usage limit reached. Please upgrade."}));
  }
  // Rate limit check
  const { success, reset, remaining } = await ratelimit.limit(email);
  if (!success) {
    return new Response(JSON.stringify({ output: "Usage temporarily limited. Please wait and try again shortly." }), {
      status: 429,
      headers: {
        "X-RateLimit-Limit": "20",                // Total allowed
        "X-RateLimit-Remaining": `${remaining}`,  // Left
        "X-RateLimit-Reset": `${reset}`,          // When it resets (UNIX timestamp)
      },
    });
  }

  const prompt = await buildCoverLetterPrompt(resume, job, industry);


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

import { GoogleGenAI } from "@google/genai";
import { buildCoverLetterPrompt } from "../../../utils/promptBuilder";
import { checkUserUsage } from "@/middleware/checkUser";
import { ratelimit } from "@/lib/rateLimiter";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const DEFAULT_MODEL = process.env.GOOGLE_MODEL || 'gemini-2.0-flash';
const FALLBACK_MODEL = process.env.GOOGLE_MODEL_FALLBACK || 'gemini-2.0-flash-lite';

export async function POST(req: Request) {
  try {
    console.log("route entered.");
    const contentType = req.headers.get("content-type");
    console.log("headers", req.headers);
    let resume: string | Buffer;
    let job: string;
    let email: string;
    let industry: string;

    if (contentType?.includes("application/json")) {
      try {
        const data = await req.json();
        resume = data.resume;
        job = data.job;
        email = data.email;
        industry = data.industry || "any";
      } catch (err) {
        console.error("Error parsing JSON body:", err);
        return new Response("Invalid JSON body", { status: 400 });
      }
    } else if (contentType?.includes("multipart/form-data")) {
      try {
        const formData = await req.formData();
        const file = formData.get("resume") as File;
        const arrayBuffer = await file.arrayBuffer();
        resume = Buffer.from(arrayBuffer);
        job = formData.get("job") as string;
        email = formData.get("email") as string;
        industry = formData.get("industry") as string || "Enthusiastic";
      } catch (err) {
        console.error("Error parsing multipart/form-data:", err);
        return new Response("Invalid form data", { status: 400 });
      }
    } else {
      return new Response("Unsupported content type", { status: 400 });
    }

    // Check if user has exceeded usage limits
    let usageCheck;
    try {
      usageCheck = await checkUserUsage(email);
    } catch (err) {
      console.error("Error checking user usage:", err);
      return new Response("Internal error during usage check", { status: 500 });
    }
    if (!usageCheck.allowed) {
      if (usageCheck.reason === "User has not registered. Register first before use.") {
        return new Response(JSON.stringify({ output: "User has not registered. Register first before use." }));
      }
      return new Response(JSON.stringify({ output: "Usage limit reached. Please upgrade." }));
    }

    // Rate limit check
    let rateLimitResult;
    try {
      rateLimitResult = await ratelimit.limit(email);
    } catch (err) {
      console.error("Error during rate limit check:", err);
      return new Response("Internal error during rate limit check", { status: 500 });
    }
    const { success, reset, remaining } = rateLimitResult;
    if (!success) {
      return new Response(JSON.stringify({ output: "Usage temporarily limited. Please wait and try again shortly." }), {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "20",
          "X-RateLimit-Remaining": `${remaining}`,
          "X-RateLimit-Reset": `${reset}`,
        },
      });
    }
    let prompt;
    try {
      prompt = await buildCoverLetterPrompt(resume, job, industry);
    } catch (err) {
      console.error("Error building prompt:", err);
      return new Response("Internal error building prompt", { status: 500 });
    }

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
      try {
        const retryResponse = await ai.models.generateContent({
          model: FALLBACK_MODEL,
          contents: prompt
        });

        return new Response(JSON.stringify({ output: retryResponse.text }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (fallbackErr) {
        console.error("Error with fallback model:", fallbackErr);
        return new Response("Internal error generating content", { status: 500 });
      }
    }
  } catch (err) {
    console.error("Unexpected error in POST handler:", err);
    return new Response("Internal server error", { status: 500 });
  }
}

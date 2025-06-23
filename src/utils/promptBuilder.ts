import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";

// Reference the file so it’s bundled
fs.readFileSync(path.join(process.cwd(), "test/data/05-versions-space.pdf"));


export async function buildCoverLetterPrompt(resume: string | Buffer, job: string, industry: string): Promise<string> {
  let resumeText: string;
  console.log("Buffer:", resume);
  if (Buffer.isBuffer(resume)) {
    // PDF case: extract text
    const parsed = await pdfParse(resume);
    resumeText = parsed.text;
    console.log("Parsed resume text:", resumeText);
  } else {
    // Plain text resume
    resumeText = resume;
  }  
  const prompt = `
You are a job application evaluator specializing in the ${industry} industry.

Analyze how well the following resume matches the provided job description.

Return **only** a valid JSON object using the exact structure below — no code fences or additional commentary.

{
  "matchScore": number (e.g. 75),
  "strengths": [string, string, ...],
  "gaps": [string, string, ...],
  "suggestions": [string, string, ...],
  "summary": string
}

---

Resume:
${resumeText}

---

Job Description:
${job}
  `.trim();

  return prompt;
}

import pdfParse from "pdf-parse";

export async function buildCoverLetterPrompt(resume: string | Buffer, job: string): Promise<string> {
  let resumeText: string;
  if (Buffer.isBuffer(resume)) {
    // PDF case: extract text
    const parsed = await pdfParse(resume);
    resumeText = parsed.text;
  } else {
    // Plain text resume
    resumeText = resume;
  }  
  const prompt = `
    You are an expert career coach and resume writer.
    Given the following resume and job description, generate a professional and personalized cover letter that highlights the candidate's strengths and alignment with the job.

    [Resume]
    ${resumeText}

    [Job Description]
    ${job}

    The tone should be confident and enthusiastic, and the letter should be under 350 words.
      `.trim();

  return prompt;
}
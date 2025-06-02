import pdfParse from "pdf-parse";

export async function buildCoverLetterPrompt(resume: string | Buffer, job: string, tone: string): Promise<string> {
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
    You are an expert career coach and resume writer.
    Given the following resume and job description, generate a personalized cover letter that highlights the candidate's strengths and alignment with the job.

    [Resume]
    ${resumeText}

    [Job Description]
    ${job}

    The tone should be ${tone}, and the letter should be under 350 words.
      `.trim();

  return prompt;
}
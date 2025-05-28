export function buildCoverLetterPrompt(resume: string, job: string): { system: string; user: string } {
  const system = "You are an expert career coach and resume writer.";

  const user = `
Given the following resume and job description, generate a professional and personalized cover letter that highlights the candidate's strengths and alignment with the job.

[Resume]
${resume}

[Job Description]
${job}

The tone should be confident and enthusiastic, and the letter should be under 350 words.
  `.trim();

  return { system, user };
}
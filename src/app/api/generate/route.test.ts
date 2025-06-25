// route.test.ts
import { POST } from './route';
import { buildCoverLetterPrompt } from '../../../utils/promptBuilder';
import { checkUserUsage } from '@/middleware/checkUser';
import { ratelimit } from '@/lib/rateLimiter';

jest.mock('../../../utils/promptBuilder');
jest.mock('@/middleware/checkUser');
jest.mock('@/lib/rateLimiter');

// Fully mock @google/genai before importing POST
jest.mock('@google/genai', () => {
  const mockGenerateContent = jest.fn().mockResolvedValue({ text: "mocked AI output" });
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: { generateContent: mockGenerateContent },
    })),
  };
});

const mockBuildCoverLetterPrompt = buildCoverLetterPrompt as jest.Mock;
const mockCheckUserUsage = checkUserUsage as jest.Mock;
const mockRatelimit = ratelimit.limit as jest.Mock;

const defaultPrompt = "mocked prompt";
const defaultEmail = "test@example.com";
const defaultResume = "resume text";
const defaultJob = "job text";
const defaultIndustry = "Tech";

beforeEach(() => {
  jest.clearAllMocks();
  mockBuildCoverLetterPrompt.mockResolvedValue(defaultPrompt);
  mockCheckUserUsage.mockResolvedValue({ allowed: true });
  mockRatelimit.mockResolvedValue({ success: true, reset: 9999, remaining: 10 });
});

function createJsonRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe("POST route handler", () => {
  it("processes valid JSON request successfully", async () => {
    const req = createJsonRequest({
      resume: defaultResume,
      job: defaultJob,
      email: defaultEmail,
      industry: defaultIndustry,
    });

    const res = await POST(req);
    const data = await res.json();

    expect(mockBuildCoverLetterPrompt).toHaveBeenCalledWith(defaultResume, defaultJob, defaultIndustry);
    expect(data.output).toBe("mocked AI output");
    expect(res.status).toBe(200);
  });
});

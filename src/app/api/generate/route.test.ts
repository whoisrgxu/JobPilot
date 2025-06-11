/**
 * @jest-environment node
 */
    const mockGenerateContent = jest.fn();
import { POST } from './route';
import { checkUserUsage } from '@/middleware/checkUser';
import { buildCoverLetterPrompt } from '../../../utils/promptBuilder';


// ✅ Factory-style mock for GoogleGenAI
jest.mock('@google/genai', () => ({

  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
  __esModule: true,
}));

jest.mock('@/middleware/checkUser');
jest.mock('../../../utils/promptBuilder');

describe('POST /api/generate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_API_KEY = 'test-key';
    process.env.GOOGLE_MODEL = 'gemini-2.0-flash';
    process.env.GOOGLE_MODEL_FALLBACK = 'gemini-2.0-flash-lite';
  });

  it('handles application/json input and returns AI response', async () => {
    (checkUserUsage as jest.Mock).mockResolvedValue({ allowed: true });
    (buildCoverLetterPrompt as jest.Mock).mockResolvedValue('mocked prompt');
    mockGenerateContent.mockResolvedValue({ text: 'mocked cover letter' });

    const req = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume: 'My resume text',
        job: 'Job description here',
        email: 'test@example.com',
        tone: 'Professional',
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.output).toBe('mocked cover letter');
    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-2.0-flash',
      contents: 'mocked prompt',
    });
  });

  it('falls back to fallback model on AI error', async () => {
    (checkUserUsage as jest.Mock).mockResolvedValue({ allowed: true });
    (buildCoverLetterPrompt as jest.Mock).mockResolvedValue('mocked prompt');
    mockGenerateContent
      .mockRejectedValueOnce(new Error('primary model failed'))
      .mockResolvedValueOnce({ text: 'fallback cover letter' });

    const req = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume: 'My resume text',
        job: 'Job description here',
        email: 'test@example.com',
        tone: 'Professional',
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(body.output).toBe('fallback cover letter');
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(mockGenerateContent.mock.calls[1][0].model).toBe('gemini-2.0-flash-lite');
  });

  it('rejects when user usage limit is reached', async () => {
    (checkUserUsage as jest.Mock).mockResolvedValue({
      allowed: false,
      reason: 'Usage limit reached',
    });

    const req = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume: 'resume',
        job: 'job',
        email: 'test@example.com',
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(body.output).toBe('Usage limit reached. Please upgrade.');
  });

  it('rejects unsupported content type', async () => {
    const req = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'Some plain text',
    });

    const res = await POST(req);
    const text = await res.text();

    expect(res.status).toBe(400);
    expect(text).toBe('Unsupported content type');
  });
});

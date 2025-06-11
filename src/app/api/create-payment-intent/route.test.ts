/**
 * @jest-environment node
 */

const mockCreate = jest.fn(); // ✅ Must be declared before jest.mock

import { POST } from './route';

// ✅ Mock Stripe module
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: mockCreate,
    },
  }));
});

describe('POST /api/create-payment-intent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'test-key';
  });

  it('returns clientSecret when amount is valid', async () => {
    mockCreate.mockResolvedValue({ client_secret: 'secret_123' });

    const req = new Request('http://localhost/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.clientSecret).toBe('secret_123');
    expect(mockCreate).toHaveBeenCalledWith({
      amount: 1000,
      currency: 'usd',
    });
  });

  it('returns 500 when Stripe throws an error', async () => {
    mockCreate.mockRejectedValue(new Error('Stripe error'));

    const req = new Request('http://localhost/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Payment failed');
  });
});

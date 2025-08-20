/**
 * @jest-environment node
 */

import { POST } from './route';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

jest.mock('@/lib/db', () => ({
  connectDB: jest.fn(),
}));

jest.mock('@/models/user', () => ({
  findOne: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('@/lib/jwt', () => ({
  signToken: jest.fn(),
}));

describe('POST /api/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 for invalid email', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid@example.com', password: 'wrongpass' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.message).toBe('Invalid credentials');
  });

  it('returns 401 for incorrect password', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: 'user@example.com', password: 'hashed', isPremium: false });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', password: 'wrong' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.message).toBe('Invalid credentials');
  });

  it('returns 200 and token for valid credentials', async () => {
    const mockUser = {
      userName: 'testuser',
      email: 'user@example.com',
      password: 'hashed',
      isPremium: true,
      isActive: true
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (signToken as jest.Mock).mockReturnValue('mocked-token');

    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', password: 'correct' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.token).toBe('mocked-token');
    expect(signToken).toHaveBeenCalledWith({ email: 'user@example.com', isPremium: true, userName: 'testuser', isActive: true });
  });
});

/**
 * @jest-environment node
 */

import { POST } from './route';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
// import { use } from 'react';

// Mocks
jest.mock('@/lib/db', () => ({
  connectDB: jest.fn(),
}));

jest.mock('@/models/user', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

jest.mock('@/lib/sendEmail', () => ({
  sendEmail: jest.fn(),
}));

describe('POST /api/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...process.env }; // Reset env if needed
  });

  it('returns 400 if email or password is missing', async () => {
    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      body: JSON.stringify({ email: '' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.message).toBe('User name, Email and password are required.');
  });

  it('returns 409 if email is already registered', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ _id: 'user123' });

    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: 'test', email: 'test@example.com', password: '123456' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(409);
    expect(body.message).toBe('Email is already registered.');
  });

  it('registers a new user and returns 201', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (User.create as jest.Mock).mockResolvedValue({});

    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: 'New User',
        email: 'new@example.com',
        password: 'secure123',
        isPremium: true,
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.message).toBe('User registered. Please check your email to activate your account.');
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
      email: 'new@example.com',
      password: 'hashedPassword',
      usageCount: 0,
      isActive: false,
      userName: 'New User',
      premiumPending: true,
      lastReset: expect.any(Date),
      emailVerificationExpires: expect.any(Date),
      emailVerificationTokenHash: expect.any(String),
    }));

  });

  it('returns 500 on unexpected error', async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error('Unexpected'));

    const req = new Request('http://localhost/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: 'Fail User',
        email: 'fail@example.com',
        password: '123',
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toBe('Server error.');
  });
});

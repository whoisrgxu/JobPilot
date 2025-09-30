import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { DynamoDB } from "aws-sdk";
import { sendEmail } from "./sendEmail"; // you’ll adapt this for Lambda SES/SNS

const dynamo = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || "Users";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const rawBody = event.body || event;
    const body = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;

    const { userName, email, password, isPremium } = body;

    if (!userName || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "User name, Email and password are required.",
        }),
      };
    }

    // 1. Check for existing user by email
    const existing = await dynamo
      .get({
        TableName: USERS_TABLE,
        Key: { email },
      })
      .promise();

    if (existing.Item) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "Email is already registered." }),
      };
    }

    // 2. Hash password and create token
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // 3. Create user
    const newUser = {
      email,
      userName,
      password: hashedPassword,
      usageCount: 0,
      lastReset: new Date().toISOString(),
      premiumPending: !!isPremium,
      isActive: false,
      isPremium: false,
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: expires,
      emailVerificationTokenConsumedAt: null,
      createdAt:new Date().toISOString()
    };

    await dynamo
      .put({
        TableName: USERS_TABLE,
        Item: newUser,
        ConditionExpression: "attribute_not_exists(email)",
      })
      .promise();

    // 4. Send activation email
    const activationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/activate?token=${token}`;

    const emailBody = isPremium
      ? `<p>Hi ${userName},</p><p>Thanks for registering. Please activate your account and continue to the payment page:</p><p><a href="${activationUrl}">Activate and Continue to Payment</a></p><p>This link expires in 24 hours.</p>`
      : `<p>Hi ${userName},</p><p>Thanks for registering. Please activate your account:</p><p><a href="${activationUrl}">Activate account</a></p><p>This link expires in 24 hours.</p>`;

    await sendEmail({
      to: email,
      subject: "Activate your account",
      html: emailBody,
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User registered. Please check your email to activate your account.",
      }),
    };
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error." }),
    };
  }
};

import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as const, // Ensures we use JWT and not session cookies
  },
  callbacks: {
    // async signIn({ user }: { user: import("next-auth").User }) {
    //   await connectDB();
    //   const existingUser = await User.findOne({ email: user.email });

    //   if (!existingUser) {
    //     // Redirect to register if new Google user
    //     return `/register?email=${encodeURIComponent(user.email ?? "")}`;
    //   }

    //   return true;
    // },

    async jwt({ token, user }: { token: import("next-auth/jwt").JWT; user?: import("next-auth").User }) {
    if (user) {
      await connectDB();
      let dbUser = await User.findOne({ email: user.email });
      if (!dbUser) {
        dbUser = await User.create({
        email: user.email,
        usageCount: 0,
        isPremium: false,
        });
      }
      token.email = dbUser.email;
      token.isPremium = dbUser.isPremium ?? false;
    }
      return token;
    },

    // We don't use `session()` callback since we're not using sessions
    async redirect({ baseUrl }: { baseUrl: string }) {
      // Important: Append ?oauth=true so client knows to fetch JWT and store locally
      return `${baseUrl}/generate?oauth=true`;
    },
  },
  pages: {
    signIn: "/login", // optional: your custom login page
  },
};

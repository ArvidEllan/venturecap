import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/db"

const providers = []

// Add email provider if configured
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  providers.push(
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
    })
  )
}

// Add Google provider if configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

// Fallback for development
if (providers.length === 0) {
  if (process.env.NODE_ENV === "development") {
    console.warn("No auth providers configured. Add SMTP or Google OAuth credentials.")
    providers.push(
      EmailProvider({
        server: {
          host: "localhost",
          port: 587,
        },
        from: "noreply@localhost",
      })
    )
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: providers.length > 0 ? providers : [
    // Minimal fallback - you should configure at least one provider
    EmailProvider({
      server: {
        host: "localhost",
        port: 587,
      },
      from: "noreply@localhost",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Fetch user role from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        })
        session.user.role = dbUser?.role ?? "user"
      }
      return session
    },
  },
  session: {
    strategy: "database",
  },
}


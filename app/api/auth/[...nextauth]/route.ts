import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          const existingUser = await sql`
            SELECT * FROM users WHERE email = ${user.email ?? ''}
          `;

          if (existingUser.length === 0) {
            // Create new user if doesn't exist
            await sql`
              INSERT INTO users (name, email, profile_image)
              VALUES (${user.name ?? ''}, ${user.email ?? ''}, ${
              user.image ?? ''
            })
            `;
          }

          return true;
        } catch (error) {
          console.error('Error saving user:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        // Get user from database
        const dbUser = await sql`
          SELECT id FROM users WHERE email = ${session.user.email ?? ''}
        `;

        // Add database user id to session
        session.user = {
          ...session.user,
          id: dbUser[0]?.id,
        } as any; // Type assertion to avoid TypeScript error
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + '/dashboard';
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

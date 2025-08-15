import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'


const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password ) return null;
    
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.trim()
          }
        })

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 10 * 60,
  },
  callbacks: {
    async jwt({ token, user}) {
      if (user) {
        token.id = user.id;
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
      }
    },
  },
  // pages: {
  //   signIn: '/auth/signin',
  //   signUp: '/auth/signup',
  // },
})

export { handler as GET, handler as POST }
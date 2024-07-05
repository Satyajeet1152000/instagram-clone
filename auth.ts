import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import prisma from '@/lib/prisma'
import GoogleProvider from "next-auth/providers/google";
import { Adapter, AdapterUser, AdapterAccount} from "next-auth/adapters";
import NextAuth, { getServerSession } from "next-auth/next";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

const CustomPrismaAdapter: Adapter = {
    ...PrismaAdapter(prisma),
    async createUser(user) {
      const createdUser = await prisma.user.create({ data: user });
  
      const adapterUser: AdapterUser = {
        id: createdUser.id,
        name: createdUser.name ?? '',
        email: createdUser.email ?? '',
        emailVerified: createdUser.emailVerified,
        image: createdUser.image ?? ''
      };
  
      return adapterUser;
    },
    async linkAccount(account) {
      const {
        userId, provider, providerAccountId, refresh_token, access_token, token_type,
        scope, id_token, session_state, oauth_token_secret, oauth_token, expires_at, type
      } = account;
  
      const createdAccount = await prisma.account.create({
        data: {
          userId,
          provider,
          providerAccountId,
          refresh_token: refresh_token ?? undefined,
          access_token: access_token ?? undefined,
          token_type: token_type ?? undefined,
          scope: scope ?? undefined,
          id_token: id_token ?? undefined,
          session_state: session_state ?? undefined,
          oauth_token_secret: typeof oauth_token_secret === 'string' ? oauth_token_secret : null,
        oauth_token: typeof oauth_token === 'string' ? oauth_token : null,
          expires_at: expires_at ?? undefined,
          type: type as "email" | "oauth" | "oidc"
        }
      });
  
      const adapterAccount: AdapterAccount = {
        id: createdAccount.id,
        userId: createdAccount.userId,
        type: createdAccount.type as "email" | "oauth" | "oidc",
        provider: createdAccount.provider,
        providerAccountId: createdAccount.providerAccountId,
        refresh_token: createdAccount.refresh_token ?? undefined,
        access_token: createdAccount.access_token ?? undefined,
        token_type: createdAccount.token_type as Lowercase<string> | undefined,
        scope: createdAccount.scope ?? undefined,
        id_token: createdAccount.id_token ?? undefined,
        session_state: createdAccount.session_state ?? undefined,
        oauth_token_secret: createdAccount.oauth_token_secret ?? undefined,
        oauth_token: createdAccount.oauth_token ?? undefined,
        expires_at: createdAccount.expires_at ?? undefined
      };
  
      return adapterAccount;
    },
    async unlinkAccount({ provider, providerAccountId }) {
      await prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId
          }
        }
      });
    }
  };

export const config = {
    pages: {
        signIn: "/login"
    },
    adapter: CustomPrismaAdapter,   // adapters allows to connect db instances
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({session, token}) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.username = token.username;
            }
            return session;
        },
        async jwt({token, user}){
            const prismaUser = await prisma.user.findFirst({
                where:{
                    email: token.email
                }
            })

            if(!prismaUser){
                token.id = user.id;
                return token
            }
            if(!prismaUser.username){
                await prisma.user.update({
                    where: {
                        id: prismaUser.id
                    },
                    data: {
                        username: prismaUser.name?.split(" ").join("").toLowerCase()
                    }
                })
                return token
            }

            return {
                id: prismaUser.id,
                name: prismaUser.name,
                email: prismaUser.email,
                username: prismaUser.username,
                picture: prismaUser.image,
            }

        }
    }
} satisfies NextAuthOptions;

export default NextAuth(config)

// use it in server contexts
export function auth(
    ...args:
        | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
        | [NextApiRequest, NextApiResponse]
        | [] 
){
    return getServerSession(...args, config)
}
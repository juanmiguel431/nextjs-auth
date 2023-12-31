import NextAuth, {Awaitable, NextAuthOptions} from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import FacebookProvider from "next-auth/providers/facebook"
// import GithubProvider from "next-auth/providers/github"
// import TwitterProvider from "next-auth/providers/twitter"
// import Auth0Provider from "next-auth/providers/auth0"
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from 'next-auth/providers/credentials';

import {verifyPassword} from '@/lib/auth';
import MongoDbClient from "@/apis/mongodb";
import {MongoServerError} from "mongodb";
import {User} from "next-auth/src/core/types";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

export const authOptions: NextAuthOptions = {
  secret: "YvTlOHaNSxIotKF93mthQtTtPjOxRhLPI720BcJnv7M=",
  session: {
    strategy: 'jwt'
  },
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    /* EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains

    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET,
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET,
    // }),
    // Auth0Provider({
    //   clientId: process.env.AUTH0_ID,
    //   clientSecret: process.env.AUTH0_SECRET,
    //   issuer: process.env.AUTH0_ISSUER,
    // }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {label: "Username", type: "text", placeholder: "jsmith"},
        password: {label: "Password", type: "password"},
        email: {label: "Email", type: "text"}
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        //         const res = await fetch("/your/endpoint", {
        //           method: 'POST',
        //           body: JSON.stringify(credentials),
        //           headers: { "Content-Type": "application/json" }
        //         })
        //         const user = await res.json()

        // If no error and we have user data, return it
        //           if (res.ok && user) {
        //             return user
        //           }
        // Return null if user data could not be retrieved
        //             return null

        if (!credentials) {
          throw Error('You most provide the credentials.');
        }

        const client = new MongoDbClient<User>('users');
        try {
          await client.connect();
          const user: any = await client.findOne({email: credentials.email});

          if (!user) {
            throw Error('User not found');
          }

          const isValid = await verifyPassword(credentials.password, user.password);

          if (!isValid) {
            throw Error('Could not log you in');
          }

          const result: Awaitable<User | null> = {email: user.email, id: user._id};

          return result;

        } catch (error) {
          if (error instanceof MongoServerError) {
            console.log(`Error worth logging: ${error}`);
          }

          throw error;
        } finally {
          await client.close();
        }
      }
    })
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({token}) {
      token.userRole = "admin"
      return token
    },
  },
}

export default NextAuth(authOptions)

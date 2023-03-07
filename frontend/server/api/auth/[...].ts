// file: ~/server/api/auth/[...].ts
import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: useRuntimeConfig().Secret,
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.id = account.id
      }
      return token
    }
  },
  providers: [
    // @ts-expect-error
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "",
        },
      },
      authorize(credentials: any) {
        const user = {
          id: "1",
          name: "nsdevADMIN_ACCOUNT",
          username: useRuntimeConfig().user,
          password: useRuntimeConfig().pass,
        };
        if (
          credentials?.username === user.username &&
          credentials?.password === user.password
        ) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // eslint-disable-next-line no-console
          console.error(
            "Warning: Malicious login attempt registered, bad credentials provided"
          );

          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }
      },
    }),
  ],
});

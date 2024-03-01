// file: ~/server/api/auth/[...].ts
import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";

export default NuxtAuthHandler({
  secret: process.env.SECRET,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
        accesscode: {
          label: "Access Code",
          type: "text",
        },
      },
      authorize(credentials: any) {
        const user = {
          id: "1",
          name: "ADMINISTRATOR",
          username: useRuntimeConfig().credentials.username,
          password: useRuntimeConfig().credentials.password,
          accesscode: useRuntimeConfig().credentials.accesscode,
        };
        if (
          credentials?.username === user.username &&
          credentials?.password === user.password &&
          credentials?.accesscode === user.accesscode
        ) {
          return user;
        } else {
          console.error(
            "Warning: Malicious login attempt registered, bad credentials provided"
          );
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  
});

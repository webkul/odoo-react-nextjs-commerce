import { TOKEN } from "lib/constants";
import { createCart, getCart, odooFetch } from "lib/odoo";
import { isObject } from "lib/type-guards";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: Record<"password" | "username", string> | undefined): Promise<any> => {
        /* Getting Token from generateCustomerToken */
        const input = {
          email: credentials?.username,
          password: credentials?.password,
        };
        try {
          const res = await odooFetch<any>({
            query: "login",
            method: "POST",
            variables: {
              ...input,
            },
          });
          if (res?.status === 200 && res?.body?.success && res?.body?.authorization && res?.body?.email) {
            const customerInfo = res?.body;
            (await cookies()).set(TOKEN, customerInfo?.authorization);
            (await cookies()).delete("order_number");
            const cart = await createCart();
            const cartId = cart.id;
            (await cookies()).set("cartId", cartId, { httpOnly: true, secure: false });
            await getCart();
            return {
              firstname: customerInfo.firstName,
              lastname: customerInfo.lastName,
              name: customerInfo.userName,
              token: customerInfo.authorization,
              email: customerInfo.email,
            };
          } else {
            throw new Error(res?.body?.message || "Something went wrong!");
          }
        } catch (error: any) {
          throw new Error((error?.message as string) || "Something went wrong!");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (isObject(user) && user.token) {
        token.accessToken = user.token;
        token.role = "customer";
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          accessToken: token.accessToken as string,
          role: token.role,
        },
        error: token.error,
      };
    },
  },
  pages: {
    signIn: "/customer/login",
    error: "/login",
  },
};
export const handler = NextAuth(authOptions);

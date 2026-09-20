import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

type AppRole = "ADMIN" | "CUSTOMER" | "CLIENT";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      role?: AppRole;
    };
  }

  interface User {
    id?: string;
    role?: AppRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: AppRole;
  }
}

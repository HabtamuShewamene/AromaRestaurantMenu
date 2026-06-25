import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

type AppRole = "ADMIN" | "CLIENT";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: AppRole;
    };
  }

  interface User {
    role?: AppRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: AppRole;
  }
}

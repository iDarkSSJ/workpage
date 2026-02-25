import { auth } from "../auth/auth"

// infer session types - jose
// https://www.better-auth.com/docs/concepts/typescript#inferring-types

type Session = typeof auth.$Infer.Session

declare global {
  namespace Express {
    interface Request {
      session?: Session
    }
  }
}

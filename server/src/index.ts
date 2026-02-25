import express from "express"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./auth/auth"
import cors from "cors"
import authRouter from "./router/auth"

const app = express()
const port = 3000

app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,
  }),
)

app.use("/api/auth", authRouter)

// BETTER AUTH HANDLER - `https://www.better-auth.com/docs/integrations/express#mount-the-handler`
// IT HAVE TO BE BEFORE THE JSON MIDDLEWARE - (jose)
app.all("/api/auth/*splat", toNodeHandler(auth))

app.use(express.json())

app.listen(port, () => {
  console.log(
    `Express app listening on port: http://localhost:${port}/api/auth/ok`,
  )
})

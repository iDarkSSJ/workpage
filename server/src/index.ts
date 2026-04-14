import express from "express"
import { createServer } from "http"
import { initSocket } from "./socket"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./auth/auth"
import cors from "cors"
import authRouter from "./router/auth"
import apiRouter from "./router/index"
import { errorHandler } from "./middleware/errorHandler"
const app = express()
const port = 3000

app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost"],
    credentials: true,
  }),
)

app.use("/api/auth", authRouter)

// BETTER AUTH HANDLER - `https://www.better-auth.com/docs/integrations/express#mount-the-handler`
// IT HAVE TO BE BEFORE THE JSON MIDDLEWARE - (jose)
app.all("/api/auth/*splat", toNodeHandler(auth))

app.use(express.json())

app.use("/api", apiRouter)

app.use(errorHandler)

const server = createServer(app)

initSocket(server)

server.listen(port, () => {
  console.log(`Express & Socket.io listening on port: http://localhost:${port}`)
})

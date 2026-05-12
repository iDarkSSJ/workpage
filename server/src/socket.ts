import { Server as SocketIOServer } from "socket.io"
import { Server as HttpServer } from "http"

let io: SocketIOServer

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  })

  io.on("connection", (socket) => {
    socket.on("join_conversation", (conversationId: string) => {
      socket.join(`conversation_${conversationId}`)
    })

    socket.on("leave_conversation", (conversationId: string) => {
      socket.leave(`conversation_${conversationId}`)
    })

    socket.on("disconnect", () => {
    })
  })

  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io never initialized!")
  }
  return io
}

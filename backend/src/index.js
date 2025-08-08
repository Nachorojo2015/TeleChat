import express from "express";
import { PORT } from "./config/variables.js";
import { usersRouter } from "./routes/users.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { chatsRouter } from "./routes/chats.routes.js";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middlewares/authenticateToken.middleware.js";
import { groupRouter } from "./routes/groups.routes.js";
import { channelRouter } from "./routes/channels.routes.js";
import { privateChatRouter } from "./routes/privateChats.routes.js";
import { messagesRouter } from "./routes/messages.routes.js";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

app.use("/auth", authRouter);
app.use("/users", authenticateToken, usersRouter);
app.use("/chats", authenticateToken, chatsRouter);
app.use("/groups", authenticateToken, groupRouter);
app.use("/channels", authenticateToken, channelRouter);
app.use("/privates", authenticateToken, privateChatRouter);
app.use("/messages", authenticateToken, messagesRouter);

// Comunicacion con sockets
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.on("connection", (socket) => {
    console.log('Usuario conectado')

    socket.on('receive-message', ({ message, chatId }) => {
      console.log("Mensaje recibido en el servidor:", message, chatId);
      socket.broadcast.emit('send-message', { message, chatId });
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado')
    })
});

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

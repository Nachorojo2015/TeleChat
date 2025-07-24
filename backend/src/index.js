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

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/users', authenticateToken, usersRouter)
app.use('/chats', authenticateToken, chatsRouter)
app.use('/groups', authenticateToken, groupRouter)
app.use('/channels', authenticateToken, channelRouter)
app.use('/privates', authenticateToken, privateChatRouter)


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})
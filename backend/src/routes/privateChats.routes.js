import { Router } from "express";
import { createPrivateChat, deletePrivateChat, getPrivateChat } from "../controllers/privateChats.controller.js";

const privateChatRouter = Router()

privateChatRouter.post('/create/:id', createPrivateChat)

privateChatRouter.get('/private/:id', getPrivateChat)

privateChatRouter.delete('/delete/:id', deletePrivateChat)

export { privateChatRouter }
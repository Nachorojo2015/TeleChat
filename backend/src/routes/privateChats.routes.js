import { Router } from "express";
import { createPrivateChat, getPrivateChat } from "../controllers/privateChats.controller.js";

const privateChatRouter = Router()

privateChatRouter.post('/create/:id', createPrivateChat)

privateChatRouter.get('/private/:id', getPrivateChat)

export { privateChatRouter }
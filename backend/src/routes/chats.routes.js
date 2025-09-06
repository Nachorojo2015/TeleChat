import { Router } from "express";
import { deleteChat, getChats } from "../controllers/chats.controller.js";

const chatsRouter = Router();

chatsRouter.get("/", getChats)

chatsRouter.delete('/delete/:id', deleteChat)

export { chatsRouter } 
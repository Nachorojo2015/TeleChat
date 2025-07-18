import { Router } from "express";
import { getChat, getChats } from "../controllers/chats.controller.js";

const chatsRouter = Router();

chatsRouter.get("/", getChats)

chatsRouter.get("/:id", getChat)

export { chatsRouter } 
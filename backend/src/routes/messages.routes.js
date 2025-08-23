import { Router } from "express"
import { createMessage, deleteMessage, getMessages } from "../controllers/message.controller.js"
import multer from "multer";
import { storage } from "../config/multerConfig.js";

const upload = multer({ storage })

const messagesRouter = Router()

messagesRouter.get('/:chatId', getMessages)

messagesRouter.post('/create/:chatId', upload.single('file'), createMessage)

messagesRouter.delete('/delete/:messageId', deleteMessage)

export { messagesRouter }
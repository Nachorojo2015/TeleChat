import { Router } from "express"
import { createMessage, deleteMessage, editMessage, getMessages, pinMessage, reactMessage, viewMessage } from "../controllers/message.controller.js"
import multer from "multer";
import { storage } from "../config/multerConfig.js";

const upload = multer({ storage })

const messagesRouter = Router()

messagesRouter.post('/create/:chatId', upload.single('file'), createMessage)

messagesRouter.get('/:chatId', getMessages)

messagesRouter.put('/delete/:messageId', deleteMessage)

messagesRouter.put('/edit/:messageId', editMessage)

messagesRouter.put('/pin/:messageId/:chatId', pinMessage)

messagesRouter.post('/view/:messageId', viewMessage)

messagesRouter.post('/react/:messageId', reactMessage)

export { messagesRouter }
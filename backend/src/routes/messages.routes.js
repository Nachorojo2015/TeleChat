import { Router } from "express"
import { createMessage, deleteMessage, editMessage, getMessages, pinMessage, reactMessage, viewMessage } from "../controllers/message.controller.js"

const messagesRouter = Router()

messagesRouter.post('/create/:chatId', createMessage)

messagesRouter.get('/:chatId', getMessages)

messagesRouter.put('/delete/:messageId', deleteMessage)

messagesRouter.put('/edit/:messageId', editMessage)

messagesRouter.put('/pin/:messageId/:chatId', pinMessage)

messagesRouter.post('/view/:messageId', viewMessage)

messagesRouter.post('/react/:messageId', reactMessage)

export { messagesRouter }
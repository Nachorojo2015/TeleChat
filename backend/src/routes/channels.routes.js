import { Router } from "express";
import { createChannel, deleteChannel, editChannel, getChannel, getOut, joinChannel } from "../controllers/channel.controller.js";
import multer from "multer";
import { storage } from "../config/multerConfig.js";

const upload = multer({ storage })

const channelRouter = Router()

channelRouter.post('/create', upload.single('picture'), createChannel)

channelRouter.get('/channel/:id', getChannel)

channelRouter.post('/join/:id', joinChannel)

channelRouter.delete('/out/:id', getOut)

channelRouter.delete('/delete/:id', deleteChannel)

channelRouter.put('/edit/:id', upload.single('picture'), editChannel)

export { channelRouter }
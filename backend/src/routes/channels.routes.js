import { Router } from "express";
import { createChannel, deleteChannel, getChannel, getOut, joinChannel } from "../controllers/channel.controller.js";

const channelRouter = Router()

channelRouter.post('/create', createChannel)

channelRouter.get('/channel/:id', getChannel)

channelRouter.post('/join/:id', joinChannel)

channelRouter.delete('/out/:id', getOut)

channelRouter.delete('/delete/:id', deleteChannel)

export { channelRouter }
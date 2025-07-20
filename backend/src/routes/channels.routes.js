import { Router } from "express";
import { getChannel } from "../controllers/channel.controller.js";

const channelRouter = Router()

channelRouter.get('/channel/:id', getChannel)

export { channelRouter }
import { Router } from "express";
import { createGroup, getGroup } from "../controllers/group.controller.js";

const groupRouter = Router();

groupRouter.post('/create', createGroup)

groupRouter.get('/group/:id', getGroup)

export { groupRouter }
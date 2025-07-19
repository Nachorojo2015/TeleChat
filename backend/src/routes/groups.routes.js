import { Router } from "express";
import { addMember, createGroup, deleteGroup, editGroup, getGroup, getOut, joinGroup } from "../controllers/group.controller.js";

const groupRouter = Router();

groupRouter.post('/create', createGroup)

groupRouter.get('/group/:id', getGroup)

groupRouter.delete('/out/:id', getOut)

groupRouter.delete('/delete/:id', deleteGroup)

groupRouter.put('/edit/:id', editGroup)

groupRouter.post('/join/:id', joinGroup)

groupRouter.post('/add/:groupId/:userId', addMember)

export { groupRouter }
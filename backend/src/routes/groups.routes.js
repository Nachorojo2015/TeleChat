import { Router } from "express";
import { createGroup, editGroup, getGroup, getGroupsByName, getMembers, getOut, joinGroup } from "../controllers/group.controller.js";
import multer from "multer";
import { storage } from "../config/multerConfig.js";

const upload = multer({ storage })

const groupRouter = Router();

groupRouter.post('/create', upload.single('picture'), createGroup)

groupRouter.get('/group/:id', getGroup)

groupRouter.delete('/out/:id', getOut)

groupRouter.put('/edit/:id', upload.single('picture'), editGroup)

groupRouter.post('/join/:id', joinGroup)

groupRouter.get('/:name', getGroupsByName)

groupRouter.get('/members/:id', getMembers)

export { groupRouter }
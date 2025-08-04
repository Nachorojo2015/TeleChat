import { Router } from "express";
import { addMember, banMember, becomeMember, becomeMemberAdmin, createGroup, deleteGroup, editGroup, getGroup, getGroupsByName, getOut, joinGroup, muteMember, removeMember, unbanMember, unmuteMember } from "../controllers/group.controller.js";
import multer from "multer";
import { storage } from "../config/multerConfig.js";

const upload = multer({ storage })

const groupRouter = Router();

groupRouter.post('/create', upload.single('picture'), createGroup)

groupRouter.get('/group/:id', getGroup)

groupRouter.delete('/out/:id', getOut)

groupRouter.delete('/delete/:id', deleteGroup)

groupRouter.put('/edit/:id', upload.single('picture'), editGroup)

groupRouter.post('/join/:id', joinGroup)

groupRouter.post('/add/:groupId/:userId', addMember)

groupRouter.delete('/remove/:groupId/:userId', removeMember)

groupRouter.delete('/ban/:groupId/:userBanId', banMember)

groupRouter.post('/unban/:groupId/:userBanId', unbanMember)

groupRouter.put('/mute/:groupId/:userId', muteMember)

groupRouter.put('/unmute/:groupId/:userId', unmuteMember)

groupRouter.put('/admin/:groupId/:userId', becomeMemberAdmin)

groupRouter.put('/member/:groupId/:userId', becomeMember)

groupRouter.get('/:name', getGroupsByName)

export { groupRouter }
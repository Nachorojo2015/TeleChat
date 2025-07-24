import { Router } from "express";
import { addMember, banMember, becomeMember, becomeMemberAdmin, createGroup, deleteGroup, editGroup, getGroup, getOut, joinGroup, muteMember, removeMember, unbanMember, unmuteMember } from "../controllers/group.controller.js";

const groupRouter = Router();

groupRouter.post('/create', createGroup)

groupRouter.get('/group/:id', getGroup)

groupRouter.delete('/out/:id', getOut)

groupRouter.delete('/delete/:id', deleteGroup)

groupRouter.put('/edit/:id', editGroup)

groupRouter.post('/join/:id', joinGroup)

groupRouter.post('/add/:groupId/:userId', addMember)

groupRouter.delete('/remove/:groupId/:userId', removeMember)

groupRouter.delete('/ban/:groupId/:userBanId', banMember)

groupRouter.post('/unban/:groupId/:userBanId', unbanMember)

groupRouter.put('/mute/:groupId/:userId', muteMember)

groupRouter.put('/unmute/:groupId/:userId', unmuteMember)

groupRouter.put('/admin/:groupId/:userId', becomeMemberAdmin)

groupRouter.put('/member/:groupId/:userId', becomeMember)

export { groupRouter }
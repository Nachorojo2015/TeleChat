import { Router } from "express";
import { blockUser, getMyUser, getUsersByUsername, unlockUser } from "../controllers/users.controller.js";

const usersRouter = Router()

usersRouter.get('/myUser', getMyUser)

usersRouter.post('/block/:id', blockUser)

usersRouter.delete('/unlock/:id', unlockUser)

usersRouter.get('/:username', getUsersByUsername)

export { usersRouter }
import { Router } from "express";
import { blockUser, getMyUser, unlockUser } from "../controllers/users.controller.js";

const usersRouter = Router()

usersRouter.get('/myUser', getMyUser)

usersRouter.post('/block/:id', blockUser)

usersRouter.delete('/unlock/:id', unlockUser)

export { usersRouter }
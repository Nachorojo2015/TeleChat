import { Router } from "express";
import { getMyUser, getUser } from "../controllers/users.controller.js";

const usersRouter = Router()

usersRouter.get('/myUser', getMyUser)

usersRouter.get('/user/:id', getUser)

export { usersRouter }
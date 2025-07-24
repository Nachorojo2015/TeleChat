import { Router } from "express";
import { login, logout, refreshToken, register } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post('/register', register)

authRouter.post('/login', login)

authRouter.post('/refresh', refreshToken)

authRouter.post('/logout', logout)

export { authRouter }
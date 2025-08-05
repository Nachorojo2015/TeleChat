import { Router } from "express";
import { blockUser, editProfile, getMyUser, getUsersByUsername, unlockUser } from "../controllers/users.controller.js";
import multer from "multer";
import { storage } from "../config/multerConfig.js";

const upload = multer({ storage })

const usersRouter = Router()

usersRouter.get('/myUser', getMyUser)

usersRouter.post('/block/:id', blockUser)

usersRouter.delete('/unlock/:id', unlockUser)

usersRouter.get('/:username', getUsersByUsername)

usersRouter.put('/edit-profile', upload.single('profile-picture'), editProfile)

export { usersRouter }
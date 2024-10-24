import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/user.controller.js";
import { verifyJwt } from "../middelware/auth.middleware.js";


const router = Router();

router.post("/register",registerUser)
router.post("/login",loginUser)

export default router
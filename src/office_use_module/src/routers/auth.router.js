import { Router } from "express";
import AuthController  from "../controllers/auth.controller.js";

const router = Router();

router.route("/login").post(AuthController.loginUser);

export default router;

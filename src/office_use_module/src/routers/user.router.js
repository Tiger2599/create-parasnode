import { Router } from "express";
import tokenHandler from "../middlewares/auth.middleware.js";
import UserController  from "../controllers/user.controller.js";

const router = Router();

router.route("/getUser").get(tokenHandler.verifyToken, UserController.getUser);
router.route("/before-claim").post(tokenHandler.verifyToken, UserController.beforeClaim);
router.route("/claim").post(tokenHandler.verifyToken, UserController.claim);
router.route("/claim-list").get(tokenHandler.verifyToken, UserController.claimList);

export default router;

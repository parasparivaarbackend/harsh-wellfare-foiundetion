import { Router } from "express";
import { otpverify, Register } from "../../controller/auth.controller.js";

const router = Router();

router.route("/signup").post(Register);

router.route("/otpverify").post(otpverify);
export default router;

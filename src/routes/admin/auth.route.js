import { Router } from "express";
import { Register } from "../../controller/auth.controller.js";

const router = Router();

router.route("/signup").post(Register);

export default router;

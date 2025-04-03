import { Router } from "express";
import authRoute from "../routes/admin/auth.route.js";

const router = Router();

router.use("/auth", authRoute);

export default router;

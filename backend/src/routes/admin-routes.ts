import { UsersController } from "@/controllers/users-controller";
import { Router } from "express";

const userRoutes = Router();
const userController = new UsersController();

userRoutes.post("/", userController.create);

export { userRoutes };

import { AdminController } from "@/controllers/admin-controller";
import { Router } from "express";

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.post("/", adminController.create);
adminRoutes.delete("/:id", adminController.delete);

export { adminRoutes };

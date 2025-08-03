import { AdminController } from "@/controllers/admin-controller";
import { Router } from "express";

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.post("/", adminController.create);
adminRoutes.get("/", adminController.index);
adminRoutes.put("/:id", adminController.update);
adminRoutes.delete("/:id", adminController.delete);

export { adminRoutes };

// import { AdminController } from "@/controllers/admin-controller";
import { EngineerController } from "@/controllers/engineer-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const engineerRoutes = Router();
const engineerController = new EngineerController();

// Técnico
engineerRoutes.post(
    "/",
    ensureAuthenticated,
    verifyUserAuthorization(["admin"]),
    engineerController.create
);
engineerRoutes.get(
    "/",
    ensureAuthenticated,
    verifyUserAuthorization(["engineer", "admin", "customer"]),
    engineerController.index
);
engineerRoutes.put(
    "/:id",
    ensureAuthenticated,
    verifyUserAuthorization(["engineer", "admin"]),
    engineerController.update
);
engineerRoutes.delete(
    "/:id",
    ensureAuthenticated,
    verifyUserAuthorization(["engineer", "admin"]),
    engineerController.delete
);

export { engineerRoutes };

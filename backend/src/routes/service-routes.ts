import { ServiceController } from "@/controllers/service-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const serviceRoutes = Router();
const serviceController = new ServiceController();

// Serviço
serviceRoutes.post(
    "/",
    ensureAuthenticated,
    verifyUserAuthorization(["admin"]),
    serviceController.create
);
serviceRoutes.get("/", serviceController.index);
serviceRoutes.put(
    "/:id",
    ensureAuthenticated,
    verifyUserAuthorization(["admin"]),
    serviceController.update
);
serviceRoutes.delete(
    "/:id",
    ensureAuthenticated,
    verifyUserAuthorization(["admin"]),
    serviceController.delete
);

export { serviceRoutes };

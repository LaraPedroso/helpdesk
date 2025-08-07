import { ServiceController } from "@/controllers/service-controller";
import { Router } from "express";

const serviceRoutes = Router();
const serviceController = new ServiceController();

// Serviço
serviceRoutes.post("/", serviceController.create);
serviceRoutes.get("/", serviceController.index);
serviceRoutes.put("/:id", serviceController.update);
serviceRoutes.delete("/:id", serviceController.delete);

export { serviceRoutes };

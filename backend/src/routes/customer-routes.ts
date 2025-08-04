import { CustomerController } from "@/controllers/customer-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const customerRoutes = Router();
const customerController = new CustomerController();

customerRoutes.get(
    "/",
    ensureAuthenticated,
    verifyUserAuthorization(["admin"]),
    customerController.index
);

export { customerRoutes };

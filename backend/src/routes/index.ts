import { Router } from "express";
import { sessionRoutes } from "./session-routes";
import { adminRoutes } from "./admin-routes";

const routes = Router();

routes.use("/admin", adminRoutes);
routes.use("/session", sessionRoutes);

export { routes };

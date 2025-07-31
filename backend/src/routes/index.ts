import { Router } from "express";
import { sessionRoutes } from "./session-routes";
import { userRoutes } from "./admin-routes";

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/session", sessionRoutes);

export { routes };

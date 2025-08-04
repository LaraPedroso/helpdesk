import { Router } from "express";
import { sessionRoutes } from "./session-routes";
import { userRoutes } from "./user-routes";
import { engineerRoutes } from "./engineer-routes";

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/session", sessionRoutes);
routes.use("/admin/engineer", engineerRoutes);

export { routes };

import { Router } from "express";

import { userRoutes } from "./user-routes";
import { sessionRoutes } from "./session-routes";
import { engineerRoutes } from "./engineer-routes";
import { customerRoutes } from "./customer-routes";

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/session", sessionRoutes);
routes.use("/admin/engineer", engineerRoutes);
routes.use("/admin/customer", customerRoutes);

export { routes };

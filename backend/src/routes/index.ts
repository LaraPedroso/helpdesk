import { Router } from "express";

import { userRoutes } from "./user-routes";
import { sessionRoutes } from "./session-routes";
import { engineerRoutes } from "./engineer-routes";
import { customerRoutes } from "./customer-routes";
import { serviceRoutes } from "./service-routes";

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/session", sessionRoutes);
routes.use("/engineer", engineerRoutes);
routes.use("/customer", customerRoutes);
routes.use("/services", serviceRoutes);

export { routes };

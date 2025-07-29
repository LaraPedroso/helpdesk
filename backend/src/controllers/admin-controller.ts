import { Request, Response, NextFunction } from "express";

class AdminController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            response
                .status(201)
                .json({ message: "Admin created successfully" });
        } catch (error) {
            next(error);
        }
    }
}

export { AdminController };

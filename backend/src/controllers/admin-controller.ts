import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import z from "zod";

class AdminController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string().min(1, "Name is required"),
                email: z.email("Invalid email format"),
                password: z
                    .string()
                    .min(6, "Password must be at least 6 characters"),
                role: z.string().optional(),
            });

            const { name, email, password, role } = bodySchema.parse(
                request.body
            );

            if (role !== "tech") {
                throw new AppError(
                    "Admin users can only create accounts with 'tech' role",
                    400
                );
            }

            return response.status(201).json({
                message: "Tech user created successfully",
                user: { name },
                requestBody: request.body,
            });
        } catch (error) {
            next(error);
        }

        response.status(501).json({ message: "Not implemented yet" });
    }
}

export { AdminController };

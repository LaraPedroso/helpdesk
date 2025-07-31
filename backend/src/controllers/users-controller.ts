import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { Request, Response, NextFunction } from "express";
import z from "zod";

class UsersController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string().min(1, "Name is required"),
                email: z.email("Invalid email format"),
                password: z
                    .string()
                    .min(6, "Password must be at least 6 characters"),
            });

            const { name, email, password } = bodySchema.parse(request.body);

            // returns the first record in a list that matches your criteria
            const userSameEmail = await prisma.user.findFirst({
                where: { email },
            });

            if (userSameEmail) {
                return response.status(400).json({
                    message: "User with this email already exists",
                });
            }

            // 2^8 = 256 iterations
            const hashedPassword = await hash(password, 8);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            const { password: _, ...userWithoutPassword } = user;

            response.status(201).json({
                userWithoutPassword,
            });
        } catch (error) {
            next(error);
        }
    }
}

export { UsersController };

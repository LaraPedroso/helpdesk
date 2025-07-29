import { Request, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
// import { sign } from "jsonwebtoken";
import z from "zod";
import { authConfig } from "@/configs/auth";

class SessionController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                email: z.email(),
                password: z.string().min(6),
            });

            const { email, password } = bodySchema.parse(request.body);

            const user = await prisma.user.findFirst({
                where: { email },
            });

            if (!user) {
                throw new AppError("Invalid email or password", 401);
            }

            const passwordMatch = await compare(password, user.password);

            if (!passwordMatch) {
                throw new AppError("Invalid email or password", 401);
            }

            const { secret, expiresIn } = authConfig.jwt;

            response.status(201).json({ secret, expiresIn });
        } catch (error) {
            next(error);
        }
    }
}

export { SessionController };

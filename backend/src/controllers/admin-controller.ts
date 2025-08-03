import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { generatePassword } from "@/utils/generatePassword";
import { sendMail } from "@/utils/mail";
import { hash } from "bcrypt";
import { Request, Response, NextFunction } from "express";
import z from "zod";

class AdminController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string().min(1, "Name is required"),
                email: z.email("Invalid email format"),
                password: z.string().optional(),
                role: z.string().optional(),
                schedule: z.object({
                    start: z.string().optional(),
                    end: z.string().optional(),
                }),
            });

            const { name, email, password, role, schedule } = bodySchema.parse(
                request.body
            );

            const userSameEmail = await prisma.user.findFirst({
                where: { email },
            });

            if (role !== "tech") {
                throw new AppError(
                    "Admin users can only create accounts with 'tech' role",
                    400
                );
            }

            if (userSameEmail) {
                throw new AppError("User with this email already exists", 400);
            }

            const passwordTemporary =
                role === "tech" ? generatePassword() : password;

            const hashedPassword = await hash(passwordTemporary ?? "", 8);

            if (role === "tech") {
                await sendMail(
                    email,
                    "Sua senha temporária - Sistema HelpDesk",
                    `Olá ${name},\n\nSua conta foi criada com sucesso.\nSua senha temporária é: ${passwordTemporary}\n\nAcesse o sistema e altere sua senha o quanto antes.`
                );
            }
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    schedules: {
                        create: [
                            {
                                startTime: schedule.start ?? "08:00",
                                endTime: schedule.end ?? "17:00",
                            },
                        ],
                    },
                },
            });

            const { password: _, ...userWithoutPassword } = user;

            return response.status(201).json({
                user: userWithoutPassword,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;

            const user = await prisma.user.findUnique({
                where: { id: Number(id) },
            });

            if (!user) {
                throw new AppError("User not found", 404);
            }

            await prisma.technicianSchedule.deleteMany({
                where: { userId: Number(id) },
            });

            await prisma.user.delete({
                where: { id: Number(id) },
            });

            return response.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export { AdminController };

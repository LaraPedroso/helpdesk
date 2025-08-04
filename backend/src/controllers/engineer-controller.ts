import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { generatePassword } from "@/utils/generatePassword";
import { sendMail } from "@/utils/mail";
import { hash } from "bcrypt";
import { Request, Response, NextFunction } from "express";
import z from "zod";

class EngineerController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string().min(1, "Name is required"),
                email: z.email("Invalid email format"),
                password: z.string().optional(),
                role: z.string().optional(),
                schedule: z.object({
                    hours: z.array(z.string()).optional(),
                }),
            });

            const { name, email, password, role, schedule } = bodySchema.parse(
                request.body
            );

            const userSameEmail = await prisma.user.findFirst({
                where: { email },
            });

            if (role !== "engineer") {
                throw new AppError(
                    "Admin users can only create accounts with 'engineer' role",
                    400
                );
            }

            if (userSameEmail) {
                throw new AppError("User with this email already exists", 400);
            }

            const passwordTemporary =
                role === "engineer" ? generatePassword() : password;

            const hashedPassword = await hash(passwordTemporary ?? "", 8);

            if (role === "engineer") {
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
                                hours: schedule?.hours ?? [
                                    "08:00",
                                    "09:00",
                                    "10:00",
                                    "11:00",
                                    "14:00",
                                    "15:00",
                                    "16:00",
                                    "17:00",
                                ],
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

    async index(request: Request, response: Response, next: NextFunction) {
        try {
            const users = await prisma.user.findMany({
                where: { role: "engineer" },
                include: {
                    schedules: true,
                },
            });

            const usersWithoutPassword = users.map(
                ({ password, ...user }) => user
            );

            if (users.length === 0) {
                throw new AppError("No technicians found", 404);
            }

            return response.status(200).json(usersWithoutPassword);
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string().min(1, "Name is required"),
                password: z.string().optional(),
                schedule: z.object({
                    hours: z.array(z.string()).optional(),
                }),
            });
            const paramsSchema = z.object({
                id: z.string(),
            });

            const { id } = paramsSchema.parse(request.params);
            const { name, password, schedule } = bodySchema.parse(request.body);

            const user = await prisma.user.findUnique({
                where: { id: Number(id) },
                include: { schedules: true },
            });

            if (!user) {
                throw new AppError("User not found", 404);
            }

            await prisma.user.update({
                where: { id: Number(id) },
                data: {
                    name,
                    password: password
                        ? await hash(password, 8)
                        : user.password,
                    schedules: {
                        update: {
                            where: {
                                id: user.schedules[0].id,
                            },
                            data: {
                                hours:
                                    schedule.hours ?? user.schedules[0].hours,
                            },
                        },
                    },
                },
            });

            return response.status(200).json({ id, password, schedule });
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

            await prisma.engineerSchedule.deleteMany({
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

export { EngineerController };

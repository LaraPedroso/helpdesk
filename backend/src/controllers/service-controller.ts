import { prisma } from "@/database/prisma";
import { Request, Response, NextFunction } from "express";

class ServiceController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const { name, description, price, category } = request.body;

            const service = await prisma.service.create({
                data: {
                    name,
                    description,
                    price,
                    category: category ?? "",
                },
            });

            return response.status(201).json(service);
        } catch (error) {
            next(error);
        }
    }

    async index(request: Request, response: Response, next: NextFunction) {
        try {
            const services = await prisma.service.findMany({
                where: { isActive: true },
            });

            return response.status(200).json(services);
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;
            const { name, description, price, category } = request.body;

            const service = await prisma.service.update({
                where: { id: Number(id) },
                data: {
                    name,
                    description,
                    price,
                    category: category ?? "",
                },
            });

            return response.status(200).json(service);
        } catch (error) {
            next(error);
        }
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;

            const service = await prisma.service.delete({
                where: { id: Number(id) },
            });

            return response.status(200).json(service);
        } catch (error) {
            next(error);
        }
    }
}

export { ServiceController };

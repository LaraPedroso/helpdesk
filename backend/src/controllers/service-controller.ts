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
            const services = await prisma.service.findMany({});

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
                    category: category,
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

            const service = await prisma.service.update({
                where: { id: Number(id) },
                data: {
                    deletedAt: new Date() ?? null,
                },
            });

            if (Number(id) !== service.id) {
                return response
                    .status(404)
                    .json({ error: "Service not found" });
            }

            if (service.id && service.deletedAt) {
                return response
                    .status(410)
                    .json({ error: "Service already deleted" });
            }

            return response.status(200).json(service);
        } catch (error) {
            next(error);
        }
    }
}

export { ServiceController };

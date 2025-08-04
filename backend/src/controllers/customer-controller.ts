import { prisma } from "@/database/prisma";
import { Request, Response, NextFunction } from "express";

class CustomerController {
    async index(request: Request, response: Response, next: NextFunction) {
        try {
            const customers = await prisma.user.findMany({
                where: { role: "customer" },
                include: {
                    schedules: true,
                    createdCalls: true,
                    addedServices: true,
                },
            });

            const customersWithoutPassword = customers.map(
                ({ password, ...customer }) => customer
            );

            return response.status(200).json(customersWithoutPassword);
        } catch (error) {
            next(error);
        }
    }
}

export { CustomerController };

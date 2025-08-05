import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { Request, Response, NextFunction } from "express";

class CustomerController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const { name, email, password } = request.body;

            const existingCustomer = await prisma.user.findUnique({
                where: { email },
            });

            if (existingCustomer) {
                throw new Error("Customer already exists");
            }

            const customer = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: await hash(password, 8),
                    role: "customer",
                },
            });

            const { password: _, ...customerWithoutPassword } = customer;

            return response.status(201).json(customerWithoutPassword);
        } catch (error) {
            next(error);
        }
    }

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
                ({ password, schedules, ...customer }) => customer
            );

            return response.status(200).json(customersWithoutPassword);
        } catch (error) {
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;
            const { name, password } = request.body;

            const customer = await prisma.user.update({
                where: { id: Number(id) },
                data: {
                    name,
                    avatarUrl: null,
                    password: password ? await hash(password, 8) : undefined,
                },
            });

            const { password: _, ...customerWithoutPassword } = customer;

            return response.status(200).json(customerWithoutPassword);
        } catch (error) {
            next(error);
        }
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;

            const customer = await prisma.user.findUnique({
                where: { id: Number(id) },
            });

            if (!customer) {
                throw new Error("Customer not found");
            }

            await prisma.user.delete({
                where: { id: Number(id) },
            });

            return response.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export { CustomerController };

export const authConfig = {
    jwt: {
        secret: (process.env.JWT_SECRET || "default") as string,
        expiresIn: "1d",
    },
};

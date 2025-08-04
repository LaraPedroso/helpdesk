import { hash } from "bcrypt";

export async function hashPassword(
    newPassword: string,
    currentPassword?: string
) {
    if (newPassword) {
        return await hash(newPassword, 8);
    }

    return currentPassword;
}

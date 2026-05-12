import { eq } from "drizzle-orm"
import { db } from "../database/database"
import * as schema from "../database/schema"
import { AppError } from "./AppError"

// Helper para obtener el ID de freelancer del usuario autenticado
export const getFreelancerId = async (userId: string) => {
    const profile = await db.query.freelancerProfile.findFirst({
        where: eq(schema.freelancerProfile.userId, userId),
        columns: { id: true },
    })

    if (!profile) throw new AppError("Perfil no encontrado", 404)
    return profile.id
}
import { PrismaClient } from '../../../../generated/prisma/index.js';
import { customServiceErrorHandler } from '../../../utils/errorHandlers/customServiceErrorHandler.js';
const prisma = new PrismaClient();
export async function updateSystem__postgres({ id, requestBody }) {
    try {
        const system = await prisma.system.update({
            where: { id },
            data: {
                controllerId: requestBody.controllerId,
                ownerEmail: requestBody.ownerEmail,
                circuitEndPoint_1: requestBody.circuitEndPoint_1,
                circuitEndPoint_2: requestBody.circuitEndPoint_2,
                circuitEndPoint_3: requestBody.circuitEndPoint_3,
                circuitEndPoint_4: requestBody.circuitEndPoint_4,
                controllerName: requestBody.controllerName,
                isActivated: requestBody.isActivated
            },
            select: {
                id: true,
                controllerId: true,
                ownerEmail: true,
                circuitEndPoint_1: true,
                circuitEndPoint_2: true,
                circuitEndPoint_3: true,
                circuitEndPoint_4: true,
                controllerName: true,
                isActivated: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return system;
    }
    catch (error) {
        customServiceErrorHandler(error);
        return;
    }
}

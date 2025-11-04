import { PrismaClient } from '../../../../generated/prisma/index.js';
import { customServiceErrorHandler } from '../../../utils/errorHandlers/customServiceErrorHandler.js';
const prisma = new PrismaClient();
export async function createSystem__postgres(data) {
    try {
        const s = data.system;
        const dataToCreate = {
            controllerId: s.controllerId,
            circuitEndPoint_1: s.circuitEndPoint_1,
            circuitEndPoint_2: s.circuitEndPoint_2,
            circuitEndPoint_3: s.circuitEndPoint_3,
            circuitEndPoint_4: s.circuitEndPoint_4
        };
        if (typeof s.ownerEmail === 'string')
            dataToCreate.ownerEmail = s.ownerEmail;
        if (typeof s.controllerName === 'string')
            dataToCreate.controllerName = s.controllerName;
        const system = await prisma.system.create({
            data: dataToCreate,
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

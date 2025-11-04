import { PrismaClient } from '../../../../generated/prisma/index.js';
import { customServiceErrorHandler } from '../../../utils/errorHandlers/customServiceErrorHandler.js';

const prisma = new PrismaClient();

export async function findSystems__postgres(data: { ownerEmail?: string }) {
  try {
    const systems = await prisma.system.findMany({
      where: data.ownerEmail ? { ownerEmail: data.ownerEmail } : undefined,
      select: {
        id: true,
        controllerId: true,
        ownerEmail: true,
        circuitEndPoint_1: true,
        circuitEndPoint_2: true,
        circuitEndPoint_3: true,
        circuitEndPoint_4: true,
        controllerName: true,
        createdAt: true,
        updatedAt: true,
        isActivated: true
      }
    });

    return systems;
  } catch (error) {
    customServiceErrorHandler(error);

    return;
  }
}

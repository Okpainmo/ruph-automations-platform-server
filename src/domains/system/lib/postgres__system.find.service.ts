import { PrismaClient } from '../../../../generated/prisma/index.js';
import { customServiceErrorHandler } from '../../../utils/errorHandlers/customServiceErrorHandler.js';

const prisma = new PrismaClient();

export async function findSystemById__postgres(data: { id: number }) {
  try {
    const system = await prisma.system.findUnique({
      where: { id: data.id },
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
  } catch (error) {
    customServiceErrorHandler(error);

    return;
  }
}

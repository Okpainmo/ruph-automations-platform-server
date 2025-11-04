import { z } from 'zod';
export const systemSchema = z.object({
    id: z.number().int().positive().optional(),
    controllerId: z.string().min(1, 'controllerId cannot be empty').optional(),
    ownerEmail: z
        .string()
        .email('Please provide a valid email address')
        .refine((val) => !val.includes(' '), 'Email cannot contain spaces')
        .optional(),
    circuitEndPoint_1: z.string().min(1, 'circuitEndPoint_1 cannot be empty').optional(),
    circuitEndPoint_2: z.string().min(1, 'circuitEndPoint_2 cannot be empty').optional(),
    circuitEndPoint_3: z.string().min(1, 'circuitEndPoint_3 cannot be empty').optional(),
    circuitEndPoint_4: z.string().min(1, 'circuitEndPoint_4 cannot be empty').optional(),
    controllerName: z.string().min(1, 'controllerName cannot be empty').optional(),
    isActivated: z.boolean().default(false).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

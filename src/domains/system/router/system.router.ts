import { Router } from 'express';
import { validateData } from '../../../middlewares/validateData.middleware.js';
import * as z from 'zod';
import { systemSchema } from '../schema/system.schema.js';
import { createSystem } from '../controllers/system.create.controller.js';
import { getSystemById } from '../controllers/system.getById.controller.js';
import sessionsMiddleware from '../../../middlewares/auth.sessions.middleware.js';
import accessMiddleware from '../../../middlewares/auth.access.middleware.js';
import { getAllSystems } from '../controllers/system.getAll.controller.js';
import { updateSystem } from '../controllers/system.update.controller.js';

export const postgresParamsSchema = z.object({
  systemId: z
    .string()
    .min(1)
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: 'Invalid Postgres ID - must be a positive number'
      }
    )
});

const router = Router();

router.post('/register-controller', validateData({ body: systemSchema }), sessionsMiddleware, accessMiddleware, createSystem);
router.get('/get-controller/:systemId', validateData({ params: postgresParamsSchema }), sessionsMiddleware, accessMiddleware, getSystemById);
router.get('/get-all-controllers', sessionsMiddleware, accessMiddleware, getAllSystems);
router.patch('/update-controller/:systemId', validateData({ params: postgresParamsSchema }), sessionsMiddleware, accessMiddleware, updateSystem);

export default router;

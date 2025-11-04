/**
 * @description Create a new system entry
 * @request POST
 * @route /api/v1/system
 * @access Protected (adjust as needed)
 */

import type { Request, Response } from 'express';
import type { SystemSpecs } from '../schema/system.schema.js';
import { createSystem__postgres } from '../lib/postgres__system.create.service.js';
import { errorHandler__500 } from '../../../utils/errorHandlers/codedErrorHandlers.js';

type ResponseSpecs = {
  error?: string;
  responseMessage: string;
  response?: {
    system: SystemSpecs;
    accessToken: string;
    refreshToken: string;
  };
};

export const createSystem = async (req: Request<{}, ResponseSpecs, SystemSpecs>, res: Response<ResponseSpecs>) => {
  try {
    const created = await createSystem__postgres({ system: req.body });

    if (req?.userData?.newUserAccessToken && req?.userData?.newUserRefreshToken) {
      res.status(201).json({
        responseMessage: 'System created successfully',
        response: {
          system: created as SystemSpecs,
          accessToken: req?.userData?.newUserAccessToken,
          refreshToken: req?.userData?.newUserRefreshToken
        }
      });
    }
  } catch (error) {
    errorHandler__500(error, res);

    return;
  }
};

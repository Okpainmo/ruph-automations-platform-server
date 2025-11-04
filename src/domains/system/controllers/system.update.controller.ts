/**
 * @description Update a system by id
 * @request PATCH
 * @route /api/v1/system/:systemId
 * @access Protected
 */

import type { Request, Response } from 'express';
import { updateSystem__postgres } from '../lib/postgres__system.update.service.js';
import { errorHandler__404, errorHandler__500 } from '../../../utils/errorHandlers/codedErrorHandlers.js';
import type { SystemSpecs } from '../schema/system.schema.js';
import { findSystemById__postgres } from '../lib/postgres__system.find.service.js';

type Params = { systemId: string };

type ResponseSpecs = {
  error?: string;
  responseMessage: string;
  response?: {
    system: SystemSpecs;
    accessToken: string;
    refreshToken: string;
  };
};

export const updateSystem = async (req: Request<Params, ResponseSpecs, Partial<SystemSpecs>>, res: Response<ResponseSpecs>) => {
  try {
    const id = parseInt(req.params.systemId);

    const exists = await findSystemById__postgres({ id });
    if (!exists) {
      errorHandler__404(`system with id: '${req.params.systemId}' not found or does not exist`, res);
      return;
    }

    const updated = await updateSystem__postgres({ id, requestBody: req.body });

    if (req?.userData?.newUserAccessToken && req?.userData?.newUserRefreshToken) {
      res.status(200).json({
        responseMessage: 'System updated successfully',
        response: {
          system: updated as SystemSpecs,
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

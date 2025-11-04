/**
 * @description Get systems - optionally filter by owner email
 * @request GET
 * @route /api/v1/system?email=foo@bar.com
 * @access Protected
 */

import type { Request, Response } from 'express';
import { findSystems__postgres } from '../lib/postgres__system.findMany.service.js';
import { errorHandler__500 } from '../../../utils/errorHandlers/codedErrorHandlers.js';
import type { SystemSpecs } from '../schema/system.schema.js';

type Query = { email?: string };

type ResponseSpecs = {
  error?: string;
  responseMessage: string;
  response?: {
    systems: SystemSpecs[];
    accessToken: string;
    refreshToken: string;
  };
};

export const getAllSystems = async (req: Request<{}, ResponseSpecs, {}, Query>, res: Response<ResponseSpecs>) => {
  try {
    const email = req.query.email;

    const systems = await findSystems__postgres({ ownerEmail: email });

    if (req?.userData?.newUserAccessToken && req?.userData?.newUserRefreshToken) {
      res.status(200).json({
        responseMessage: 'Systems fetched successfully',
        response: {
          systems: (systems || []) as SystemSpecs[],
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

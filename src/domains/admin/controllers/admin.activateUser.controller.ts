// sample controller
/**
 * @description Activate a user by ID (admin only)
 * @request PATCH
 * @route /api/v1/admin/activate-user/:userId
 * @access Admin
 */

import type { Request, Response } from 'express';
import { updateUser__postgres } from '../../user/lib/postgres__user.updateUser.service.js';
import { findUser__postgres } from '../../user/lib/postgres__user.findUser.service.js';
import { errorHandler__404, errorHandler__500, errorHandler__403, errorHandler__400 } from '../../../utils/errorHandlers/codedErrorHandlers.js';
import type { UserSpecs } from '../../user/schema/user.schema.js';

type UserProfileResponse = Pick<
  UserSpecs,
  'id' | 'name' | 'email' | 'isAdmin' | 'isActive' | 'createdAt' | 'updatedAt' | 'accessToken' | 'refreshToken'
>;

type ResponseSpecs = {
  error?: string;
  responseMessage: string;
  response?: {
    userProfile: UserProfileResponse;
    accessToken: string;
    refreshToken: string;
  };
};

export const activateUser = async (req: Request<{ userId?: string | number }, ResponseSpecs>, res: Response<ResponseSpecs>) => {
  try {
    const { userId } = req.params;

    // receive admin userData from previous middleware
    const adminUser = req?.userData?.user;

    if (adminUser && !adminUser.isAdmin) {
      errorHandler__403('You are not allowed to perform this action', res);

      return;
    }

    const userToActivate = await findUser__postgres({ userId: Number(userId) });

    if (!userToActivate) {
      errorHandler__404(`User with id: '${userId}' not found or does not exist`, res);

      return;
    }

    if (userToActivate.isActive == true) {
      return errorHandler__400(`user with id: '${userId}' is already active`, res);
    }

    const activatedUser = await updateUser__postgres({ userId: Number(userId), requestBody: { isActive: true } });

    if (activatedUser && req?.userData?.newUserAccessToken && req?.userData?.newUserRefreshToken) {
      res.status(200).json({
        responseMessage: 'User activated successfully.',
        response: {
          userProfile: {
            id: activatedUser.id,
            name: activatedUser.name || '',
            email: activatedUser.email,
            isAdmin: activatedUser.isAdmin,
            isActive: activatedUser.isActive,
            createdAt: activatedUser.createdAt,
            updatedAt: activatedUser.updatedAt
          },
          accessToken: req?.userData?.newUserAccessToken,
          refreshToken: req?.userData?.newUserRefreshToken
        }
      });
    }

    return;
  } catch (error) {
    errorHandler__500(error, res);

    return;
  }
};

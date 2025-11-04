/**
 * @description Create a new system entry
 * @request POST
 * @route /api/v1/system
 * @access Protected (adjust as needed)
 */
import { createSystem__postgres } from '../lib/postgres__system.create.service.js';
import { errorHandler__500 } from '../../../utils/errorHandlers/codedErrorHandlers.js';
export const createSystem = async (req, res) => {
    try {
        const created = await createSystem__postgres({ system: req.body });
        if (req?.userData?.newUserAccessToken && req?.userData?.newUserRefreshToken) {
            res.status(201).json({
                responseMessage: 'System created successfully',
                response: {
                    system: created,
                    accessToken: req?.userData?.newUserAccessToken,
                    refreshToken: req?.userData?.newUserRefreshToken
                }
            });
        }
    }
    catch (error) {
        errorHandler__500(error, res);
        return;
    }
};

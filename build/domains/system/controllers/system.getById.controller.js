/**
 * @description Get a system by id
 * @request GET
 * @route /api/v1/system/:systemId
 * @access Protected (adjust as needed)
 */
import { findSystemById__postgres } from '../lib/postgres__system.find.service.js';
import { errorHandler__404, errorHandler__500 } from '../../../utils/errorHandlers/codedErrorHandlers.js';
export const getSystemById = async (req, res) => {
    try {
        const id = parseInt(req.params.systemId);
        const system = await findSystemById__postgres({ id });
        if (!system) {
            errorHandler__404(`system with id: '${req.params.systemId}' not found or does not exist`, res);
            return;
        }
        if (req?.userData?.newUserAccessToken && req?.userData?.newUserRefreshToken) {
            res.status(200).json({
                responseMessage: 'System fetched successfully',
                response: {
                    system: system,
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

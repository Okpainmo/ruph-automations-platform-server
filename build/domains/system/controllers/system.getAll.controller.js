/**
 * @description Get systems - optionally filter by owner email
 * @request GET
 * @route /api/v1/system?email=foo@bar.com
 * @access Protected
 */
import { findSystems__postgres } from '../lib/postgres__system.findMany.service.js';
import { errorHandler__500 } from '../../../utils/errorHandlers/codedErrorHandlers.js';
export const getAllSystems = async (req, res) => {
    try {
        const email = req.query.email;
        const systems = await findSystems__postgres({ ownerEmail: email });
        if (req?.userData?.newUserAccessToken && req?.userData?.newUserRefreshToken) {
            res.status(200).json({
                responseMessage: 'Systems fetched successfully',
                response: {
                    systems: (systems || []),
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

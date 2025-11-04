/**
 * @description Log out current user
 * @request POST
 * @route /api/v1/auth/log-out
 * @access Protected (session only)
 */
import { updateUser__postgres } from '../../user/lib/postgres__user.updateUser.service.js';
import { clearAuthCookie } from '../../../utils/cookieDeployHandlers.js';
import { errorHandler__500 } from '../../../utils/errorHandlers/codedErrorHandlers.js';
export const LogOut = async (req, res) => {
    try {
        const email = req?.userData?.user?.email;
        if (email) {
            await updateUser__postgres({
                email,
                requestBody: {
                    accessToken: '',
                    refreshToken: ''
                }
            });
        }
        clearAuthCookie(res);
        res.status(200).json({
            responseMessage: 'User logged out successfully'
        });
    }
    catch (error) {
        errorHandler__500(error, res);
        return;
    }
};

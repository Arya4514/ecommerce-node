"use strict";

/**
 * Configuration file where you can store error codes for responses
 *
 * It's just a storage where you can define your custom API errors and their description.
 * You can call then in your action res.ok(data, sails.config.errors.USER_NOT_FOUND);
 */

module.exports = {
    errors: {
        BAD_REQUEST: {
            code: 'E_BAD_REQUEST',
            message: 'The request cannot be fulfilled due to bad syntax',
            status: 400
        },
        SESSION_TOKEN_NOT_VALID: {
            response_code: "E_SERVICES_TOKEN",
            message: "Service token is not valid",
            status: 401
        },
        CREATED: {
            code: 'CREATED',
            message: 'The request has been fulfilled and resulted in a new resource being created',
            status: 201
        },

        FORBIDDEN: {
            code: 'E_FORBIDDEN',
            message: 'User not authorized to perform the operation',
            status: 403
        },

        NOT_FOUND: {
            code: 'E_NOT_FOUND',
            message: 'The requested resource could not be found but may be available again in the future',
            status: 404
        },

        OK: {
            response_code: "0",
            message: 'Operation is successfully executed',
            status: 'success'
        },
        SERVER_ERROR: {
            response_code: "0",
            code: 'E_INTERNAL_SERVER_ERROR',
            message: 'Something bad happened on the server',
            status: 500
        },

        UNAUTHORIZED: {
            code: 'E_UNAUTHORIZED',
            message: 'Missing or invalid authentication token',
            status: 401
        },

        UNAUTHORIZED: {
            code: 'SESSION_TOKEN_NOT_VALIDE_UNAUTHORIZED',
            message: 'Invalid session token token',
            status: 401
        },

        PASSWORD_MISSMATCH: {
            code: 'PASSWORD_NOT_VALIDE_UNAUTHORIZED',
            message: 'Invalid Password',
            status: 401
        },

        PERSONAL_PIN_NOT_VALIDE: {
            code: 'PERSONAL_PIN_NOT_VALIDE',
            message: 'Invalid Personal Pin',
            status: 401
        },

        LENGTH_OF_PERSONAL_PIN_NOT_VALIDE: {
            code: 'LENGTH_OF_PERSONAL_PIN_NOT_VALIDE',
            message: 'The Length of Personal Pin Must Be 6.',
            status: 401
        },

        SUCCESS: {
            response_code: "0",
            message: 'Data retreived successfully',
            status: 200
        },

        IMAGES_NOT_AVAILABLE: {
            response_code: "0",
            message: 'There Is no Images for given data please upload it.',
            status: 200
        },

        VERIFICATION_SUCCESS: {
            response_code: "0",
            message: 'Congratulation, you verified successfully.',
            status: 'success'
        },

        VERIFICATION_FAILURE: {
            response_code: "1",
            message: 'Please Enter valid OTP.',
            status: 'error'
        },

        EMAIL_SEND_SUCCESS: {
            response_code: "0",
            message: 'Send Verification code to your email id.',
            status: 'success'
        },

        FORGOT_EMAIL_SEND_SUCCESS: {
            response_code: "0",
            message: 'Check your mail, New password sent to your Email Address',
            status: 'success'
        },

        FORGOT_EMAIL_SEND_FAILURE: {
            response_code: "1",
            message: 'No user with this email address.',
            status: 'success'
        },

        DATA_FOUND: {
            response_code: "0",
            message: 'Data retreived successfully.',
            status: 'success'
        },

        DB_QUERY_ERROR: {
            response_code: "1",
            message: 'Something went wrong with database query, please try again later.',
            status: 'error'
        },

        MANDATORY_FIELDS: {
            response_code: "1",
            message: 'Please provide all mandatory values.',
            status: 'error'

        },

        MANDATORY_FOLLOW_STEPS: {
            response_code: "1",
            message: 'Please follow all steps.',
            status: 'error'

        },

        PARAMETER_OR_VALUE_NOT_FOUND: {
            response_code: "1",
            message: 'Parameter or value missing',
            status: 'error'

        },

        DATA_NOT_FOUND: {
            response_code: "1",
            message: 'No Data Found.',
            status: 'error'
        },

        WENT_WRONG: {
            response_code: "2",
            message: 'Something went wrong,please try again later.',
            status: 'error'
        },

        WENT_WRONG_MAIL: {
            response_code: "2",
            message: 'Something went wrong to send mail,please try again later.',
            status: 'error'
        },

        ERROR_UPLOAD_PICTURE: {
            response_code: "1",
            message: 'Error occured in uploading profile picture, please try again later.',
            status: 'error'
        },
        STATION_NAME_ALREADY_EXISTS: {
            response_code: "1",
            message: 'Station name already exist.'
        },

        EMAIL_ID_ALREADY_EXITS: {
            response_code: "1",
            message: 'Email Id already exist.',
            status: 'error'
        },

        EMAIL_ID_USERNAME_ALREADY_EXITS: {
            response_code: "1",
            message: 'Email or Username already exist.',
            status: 'error'
        },

        USERNAME_ALREADY_EXITS: {
            response_code: "1",
            message: 'Username already exist.',
            status: 'error'
        },

        REVIWER_ALREADY_EXITS: {
            response_code: "1",
            message: 'Reviewer already exist.',
            status: 'error'
        },

        USER_NOT_FOUND: {
            response_code: "1",
            message: 'User not found in database.',
            status: 'error'
        },

        USER_BLOCKED: {
            response_code: "1",
            message: 'You are Blocked.Please contact to admin',
            status: 'error'
        },

        ERROR_VARIFICATION_EMAIL: {
            response_code: "1",
            message: 'Something went wrong in sending verification mail,please try again later.',
            status: 'error'
        },

        ERROR_INSERT_USER: {
            response_code: "1",
            message: 'Error occured in inserting user, please try again later.',
            status: 'error'
        },

        ERROR_SEND_VERIFICATION_MAIL: {
            response_code: "1",
            message: 'Error occured in sending verification mail, please try again later.',
            status: 'error'
        },

        ERROR_EMAIL_NOT_FOUND: {
            response_code: "1",
            message: 'Email valid email address.',
            status: 'error'
        },

        COMPLETE_USER_REGISTRATION: {
            response_code: "1",
            message: 'Complete your account registration.',
            status: 'success'
        },

        CONFIRM_PASSWORD_NOT_MATCH: {
            response_code: "1",
            message: 'Confirm password does not match.',
            status: 'error'
        },

        OLD_PASSWORD_NOT_CURRECT: {
            response_code: "1",
            message: 'Old Password is not currect.',
            status: 'error'
        },

        ERROR_UPDATE_USER_INFO: {
            response_code: "1",
            message: 'Something went wrong in updating user invitation setting, please try again later.',
            status: 'error'
        },

        EMAIL_OR_PASSWORD_WRONG: {
            response_code: "1",
            message: 'Email or password is wrong.',
            status: 'error'
        },

        LINK_EXPIRED_OR_WRONG_VERIFICATION_CODE: {
            response_code: "1",
            message: 'Your link has expired or invalid verification code.',
            status: 'error'
        },

        ERROR_USER_VERIFICATION: {
            response_code: "1",
            message: 'Something went wrong during user verification, please try again later.',
            status: 'error'
        },

        ERROR_RETRIVE_USER: {
            response_code: "1",
            message: 'Something went wrong in retrieving user info ,please try again later.',
            status: 'error'
        },

        ERROR_VALIDATE_USER: {
            response_code: "1",
            message: 'Something went wrong in validating user, please try again later.',
            status: 'error'
        },

        USER_INVITATION_NOT_FOUND: {
            response_code: "1",
            message: 'User invitation setting not found.',
            status: 'error'
        },

        ERROR_PUSH_NOTIFICATION: {
            response_code: "1",
            message: 'Something went wrong to send notification to nearer user.',
            status: 'error'
        },

        USER_ALREADY_EXIST: {
            response_code: "1",
            message: 'User already exists.',
            status: 'error'
        },

        ERROR_AUTHENTICATION: {
            response_code: "1",
            message: 'Enter valid login credentials',
            status: 'error'
        },
        ERROR_NOT_CHECKED: {
            response_code: "6",
            message: "Stop! The app is locked until your evaluation has been reviewed.",
            status: 'error'
        },

        ERROR_VERIFIED: {
            response_code: "1",
            message: "You already passed in submission.",
            status: 'error'
        },
        ALREADY_VISITED_RESET_PASSWORD: {
            response_code: "1",
            message: "Link was already expired, if you still facing issues with login then try to reset password by clicking on <b>Forget your password</b> or contact company admin to reset it.",
            status: 'error'
        },
        RESET_PASSWORD_VERIFIED: {
            response_code: "1",
            message: "Link was already expired, if you still facing issues with login then try to reset password by clicking on <b>Forget your password</b> or contact company admin to reset it.",
            status: 'error'
        },
        RESET_PASSWORD_LINK_EXPIRED: {
            response_code: "1",
            message: "Link was already expired, if you still facing issues with login then try to reset password by clicking on <b>Forget your password</b> or contact company admin to reset it.",
            status: 'error'
        },
        ERROR_EDITING_EMAIL: {
            response_code: "1",
            message: "You can not edit your email.",
            status: 'error'
        },
        INVALID_SHOP: {
            response_code: "1",
            message: "Shop name must contain .myshopify.com.",
            status: 'error'
        },
        API_KEY_NOT_FOUND: {
            response_code: "1",
            message: "APP_KEY and APP_SECRET not found",
            status: 'error'
        },
        INVALID_CREDENTIAL: {
            response_code: "E_INVALID_CRENDENTIAL",
            message: 'Credentials is not valid.',
            status: 203
        },
        OTP_EXPIRED: {
            response_code: "E_INVALID_TOKEN",
            message: "OTP is expired",
            status: 700
        },
        INVALID_EMAIL: {
            response_code: "E_INVALID_EMAIL",
            message: "Email you provided is invalid.",
            status: 404
        },

        USER_IS_NOT_ADMIN: {
            response_code: "USER_IS_NOT_ADMIN",
            message: "User is not admin",
            status: 401
        },

        NO_PERMISSION: {
            response_code: "E_INVALID_EMAIL",
            message: "User has no permission to execute this operation.",
            status: 422
        },
        ENTITY_EXIST: {
            response_code: "E_ENTITY_EXISTS",
            message: "Entity already exist.",
            status: 422
        },

        COUNTRY_EXIST: {
            response_code: "E_ENTITY_EXISTS",
            message: "Country already exist.",
            status: 422
        },

        STATE_EXIST: {
            response_code: "E_ENTITY_EXISTS",
            message: "State already exist.",
            status: 422
        },

        CITY_EXIST: {
            response_code: "E_ENTITY_EXISTS",
            message: "City already exist.",
            status: 422
        },
    }
};

/**
 * @desc    This file contain Success and Error response for sending to client / user
 */

/**
 * @desc    Send any successRes response
 *
 * @param   {string} message
 * @param   {object | array} data
 * @param   {number} statusCode
 */
exports.successRes = (result, statusCode, message) => {
  return {
    message: result.message,
    error: false,
    code: statusCode,
    data: result.data,
    response_code: result.response_code,
    status: result.status
  };
};

exports.authSuccess = async (result, statusCode, message) => {
  return {
    message: result.message,
    error: false,
    code: statusCode,
    token: result.token,
    response_code: result.response_code,
    status: result.status
  }
};

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {number} statusCode
 */
exports.errorsRes = (error, statusCode) => {
  return {
    message: error.message,
    code: statusCode,
    status: error.status,
    response_code: error.response_code,
    error: true
  };
};

/**
 * @desc    Send any validation response
 *
 * @param   {object | array} errors
 */
exports.validation = (errors) => {
  return {
    message: "Validation errors",
    error: true,
    code: 422,
    errors
  };
};

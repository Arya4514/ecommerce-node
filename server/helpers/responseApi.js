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
exports.successRes = (result, statusCode) => {
  return {
    message: result.message,
    error: false,
    code: statusCode,
    data: result.data,
    response_code: result.response_code,
    status: result.status
  };
};

exports.authSuccess = async (result, statusCode) => {
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
  /**
   * List of common HTTP request code
   * @note  You can add more http request code in here
   */
  const codes = [200, 201, 400, 401, 404, 403, 422, 500];

  // Get matched code
  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    message: error.message,
    code: statusCode,
    status: error.code ? error.code : "error",
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

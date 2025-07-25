/**
 * The function `response` generates a JSON response with a status code, message, and optional data for
 * an Express route handler.
 * @param res - The `res` parameter in the `response` function typically represents the response object
 * in a Node.js application. It is used to send a response back to the client making the request.
 * @param statusCode - The `statusCode` parameter in the `response` function is used to specify the
 * HTTP status code that will be sent in the response. It indicates the status of the request, such as
 * success (2xx) or error (4xx or 5xx).
 * @param message - The `message` parameter in the `response` function is a string that represents the
 * message or description associated with the response being sent back to the client. It could be an
 * informative message, an error message, or any other relevant information that needs to be
 * communicated.
 * @param [data=null] - The `data` parameter in the `response` function is an optional parameter that
 * allows you to pass additional data along with the response. This data can be any information that
 * you want to send back to the client along with the status code and message. If no data is provided
 * when calling the `response
 * @returns The `response` function is being returned, which takes in parameters `res`, `statusCode`,
 * `message`, and an optional `data` parameter. The function constructs a `responseObject` based on the
 * input parameters and then returns the response object using the `res` object's `status` method to
 * set the HTTP status code and `json` method to send the response object as JSON.
 */
const response = (res, statusCode, message, data = null) => {
    if (!res) {
        console.error("Response Object is Null");
        return;
    }
    const responseObject = {
        status: statusCode < 400 ? 'success' : 'error',
        message,
        data
    }
    return res.status(statusCode).json(responseObject)
}

module.exports = response






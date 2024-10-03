function getAuthToken(req) {
    return req.headers['authorization']?.split(' ')[1];// Expecting format: Bearer <token>
}
module.exports.getAuthToken = getAuthToken

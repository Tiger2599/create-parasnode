const jwt = require("jsonwebtoken");

exports.createToken = async (mid) => {
    return jwt.sign({ mid: mid, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8) }, process.env.JWT_SECRET, { algorithm: 'HS256' });
}

exports.changePasswordToken = async (email, id) => {
    return jwt.sign({ email, id, exp: Math.floor(Date.now() / 1000) + (60 * 5) }, process.env.JWT_SECRET, { algorithm: 'HS256' });
}

exports.verifyToken = async (token) => {
    var decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithm: 'HS256' }, function (err, decoded) {
        if (decoded) {
            return decoded.mid;
        }
    });
    return decoded;
}
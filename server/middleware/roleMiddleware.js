const jwt = require("jsonwebtoken");

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            return next();
        }
        try {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                return res.status(401).json({message: "Unauthorized"});
            }
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            if (decoded.role !== role) {
                return res.status(403).json({message: "No access"})
            }
            req.user = decoded;
            return next();
        } catch (e) {
            return res.status(401).json({message: e.message, type: "catch"});
        }
    }
}
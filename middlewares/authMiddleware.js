const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
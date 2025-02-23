const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    let token = req.cookies.token || req.header('Authorization');

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // ✅ Handle "Bearer " prefix
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length); // Remove "Bearer " from token
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user to request
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

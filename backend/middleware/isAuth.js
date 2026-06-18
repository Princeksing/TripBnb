import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../model/user.model.js";

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verifyToken.userId;

        if (mongoose.connection.readyState === 1) {
            const user = await User.findById(req.userId).select("role");
            req.userRole = user?.role || "user";
        } else {
            req.userRole = "user";
        }

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default isAuth;

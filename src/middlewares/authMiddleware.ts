import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(' ')[1];

    try {
        if (!token) throw new Error("Token missing");
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET environment variable is not set");
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { createUser, findUserByEmail, updateUserResetToken } from '../models/userModel.js';
import { z } from 'zod';

const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(12, "Password must be at least 12 characters"),
});

const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = signUpSchema.parse(req.body);

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await createUser(name, email, passwordHash);

        res.status(201).json({
            message: "User created successfully",
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        console.error("Sign up error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = signInSchema.parse(req.body);

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET environment variable is not set');

        const token = jwt.sign(
            { id: user.id, email: user.email },
            secret,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            message: "Sign in successful",
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = randomBytes(32).toString('hex');
        const expiry = Date.now() + 3600000; // 1 hour

        await updateUserResetToken(email, resetToken, expiry);

        // TODO: send resetToken via email (e.g. nodemailer/SendGrid)

        res.status(200).json({ message: "Password reset instructions sent to your email" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await findUserByEmail(req.user.email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

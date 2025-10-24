import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import { schemaUser } from "../validators/ValidateUser.js";
import bcrypt from "bcrypt";
import { UserModel, TagModel, LinkModel, ContentModel } from "../db/db.js";
import jwt from "jsonwebtoken";
const saltRounds = 10;

if (!JWT_SECRET) {
  throw new Error("Error fetching JWT_SECRET from environment variables");
}

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const validUser = schemaUser.safeParse(req.body);

  if (validUser.success) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const founduser = await UserModel.findOne({
        email,
      });

      if (founduser) {
        return res.status(403).json({
          error:
            "user with this email already exists. Please provide another email!",
        });
      }

      const hashedpassword = await bcrypt.hash(password, saltRounds);
      await UserModel.create({
        firstName,
        lastName,
        email,
        password: hashedpassword,
      });

      res.status(201).json({
        message: "user signed-up successfully!",
      });
    } catch (e) {
      console.error("Error Signing up:", e);
      res.status(500).json({
        error: "Error Signing Up!",
      });
    }
  } else {
    res.status(400).json({ error: validUser.error.issues });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await UserModel.findOne({
      email,
    });

    if (!foundUser) {
      return res.status(404).json({
        error: "User doesn't exist!",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid Credientials!",
      });
    }

    const token = jwt.sign({ userId: foundUser._id }, JWT_SECRET);

    res.status(200).json({
      message: "user logged-in successfully",
      token,
    });
  } catch (e) {
    console.error("Error Logging in:", e);
    res.status(500).json({
      error: "Error Logging in!",
    });
  }
});

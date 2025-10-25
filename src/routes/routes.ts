import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import { schemaUser } from "../validators/ValidateUser.js";
import { schemaContent } from "../validators/ValidateContent.js";
import bcrypt from "bcrypt";
import { UserModel, TagModel, LinkModel, ContentModel } from "../db/db.js";
import jwt from "jsonwebtoken";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import { z } from "zod";
import crypto from "crypto";
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

userRouter.use(userMiddleware);

type ContentSchemaType = z.infer<typeof schemaContent>;

userRouter.post("/content", async (req, res) => {
  const ValidContent = schemaContent.safeParse(req.body);

  if (ValidContent.success) {
    try {
      const { link, type, title, tags }: ContentSchemaType = ValidContent.data;

      const content = await ContentModel.findOne({
        title,
      });

      if (content) {
        return res.status(400).json({
          error:
            "Content with this title already exists. Please choose another title...!",
        });
      }

      const userId = req.userId;

      // Retrieve all existing tags
      const existingTags = await TagModel.find({ title: { $in: tags } });
      const existingTagNames = existingTags.map((tag) => tag.title);

      // Filter the tags which are not present in current list of tags
      const newTagNames = tags.filter(
        (tag: string) => !existingTagNames.includes(tag)
      );

      // Create the new tags in tags table
      const newTags = await TagModel.insertMany(
        newTagNames.map((title: string) => ({ title }))
      );

      //retirve the id's of all the tags
      const allTagIds = [
        ...existingTags.map((t) => t._id),
        ...newTags.map((t) => t._id),
      ];

      await ContentModel.create({
        link,
        type,
        title,
        tags: allTagIds,
        userId,
      });

      res.status(201).json({
        message: "content created successfully!",
      });
    } catch (e) {
      console.error("Error creating content:", e);
      res.status(500).json({
        error: "Error Creating Content!",
      });
    }
  } else {
    res.status(400).json({ error: ValidContent.error.issues });
  }
});

userRouter.get("/contents", async (req, res) => {
  try {
    const userContents = await ContentModel.find({
      userId: req.userId,
    });

    if (userContents.length === 0) {
      return res.status(200).json({
        message: "No Contents Found!",
      });
    }
    res.status(200).json({
      message: userContents,
    });
  } catch (e) {
    console.error("Error fetching contents:", e);
    res.status(500).json({
      error: "Error Fetching Contents!",
    });
  }
});

userRouter.put("/update-content", async (req, res) => {
  const ValidContent = schemaContent.safeParse(req.body);

  if (ValidContent.success) {
    try {
      const { contentId, link, type, title, tags }: ContentSchemaType =
        ValidContent.data;

      const foundContent = await ContentModel.findById({
        _id: contentId,
      });

      if (!foundContent) {
        return res.status(400).json({
          error: "No such content found!",
        });
      }

      if (foundContent.userId.toString() != req.userId) {
        return res.status(403).json({
          error: "unauthorized!",
        });
      }

      const userId = req.userId;

      const existingTags = await TagModel.find({ title: { $in: tags } });
      const existingTagNames = existingTags.map((tag) => tag.title);

      const newTagNames = tags.filter(
        (tag: string) => !existingTagNames.includes(tag)
      );

      const newTags = await TagModel.insertMany(
        newTagNames.map((title: string) => ({ title }))
      );

      const allTagIds = [
        ...existingTags.map((t) => t._id),
        ...newTags.map((t) => t._id),
      ];

      await ContentModel.findByIdAndUpdate(contentId, {
        link,
        type,
        title,
        tags: allTagIds,
        userId,
      });

      res.status(201).json({
        message: "content updated successfully!",
      });
    } catch (e) {
      console.error("Error updating content:", e);
      res.status(500).json({
        error: "Error Updating Content!",
      });
    }
  } else {
    res.status(400).json({ error: ValidContent.error.issues });
  }
});

userRouter.delete("/delete-content", async (req, res) => {
  try {
    const { contentId } = req.body;

    const foundContent = await ContentModel.findById({
      _id: contentId,
    });

    if (!foundContent) {
      return res.status(400).json({
        error: "No such content found!",
      });
    }

    if (foundContent.userId.toString() != req.userId) {
      return res.status(403).json({
        error: "unauthorized!",
      });
    }

    await ContentModel.findByIdAndDelete(contentId);

    res.status(200).json({
      message: "Content deleted successfully!",
    });
  } catch (e) {
    console.error("Error deleting content:", e);
    res.status(500).json({
      error: "Error Deleting Content!",
    });
  }
});

userRouter.post("/share", async (req, res) => {
  try {
    const { contentId, share } = req.body;

    const foundContent = await ContentModel.findOne({
      _id: contentId,
    });

    if (!foundContent) {
      return res.status(400).json({
        error: "content not found!",
      });
    }

    if (foundContent.userId.toString() != req.userId) {
      return res.status(403).json({
        error: "Unauthorized!",
      });
    }

    if (share === true) {
      const sharedLink = await LinkModel.create({
        hash: crypto
          .randomBytes(15)
          .toString("base64")
          .replace(/[^A-Za-z0-9]/g, "")
          .slice(0, 20),
        contentId,
        userId: req.userId,
      });

      res.status(201).json({
        message: "content shared successfully",
      });
    }

    if (share === false) {
      await LinkModel.findOneAndDelete({
        contentId: contentId,
      });

      res.status(200).json({
        message: "Content unshared successfully!",
      });
    }
  } catch (e) {
    console.error("Error Sharing content:", e);
    res.status(500).json({
      error: "Error Sharing Content!",
    });
  }
});

userRouter.get("/me", async (req, res) => {
  try {
    const user = await UserModel.findOne({
      _id: req.userId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Hello " + user.firstName + " " + user.lastName,
    });
  } catch (e) {
    console.error("Error fetching user", e);
    res.status(500).json({
      error: "Error fetching user",
    });
  }
});

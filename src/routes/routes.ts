import { Router } from "express";
import { schemaUser } from "../validators/ValidateUser.js";
import { schemaContent } from "../validators/ValidateContent.js";
import bcrypt from "bcrypt";
import { UserModel, TagModel, LinkModel, ContentModel } from "../db/db.js";
import jwt from "jsonwebtoken";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import { z } from "zod";
import crypto from "crypto";
import { JWT_SECRET_STR, saltRounds } from "../config.js";
import { Request, Response } from "express";

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const validUser = schemaUser.safeParse(req.body);

  if (validUser.success) {
    try {
      const { firstName, lastName, email, password } = validUser.data;

      const founduser = await UserModel.findOne({
        email,
      });

      if (founduser) {
        return res.status(409).json({
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
      console.error(
        `[${req.method} ${req.path}] userId=${
          req.userId || "N/A"
        } body=${JSON.stringify(req.body)} Error:`,
        e
      );

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

    if (!email || !password) {
      return res.status(400).json({
        error: "Please provide your email id and passowrd for login!",
      });
    }

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
        error: "Invalid Credentials!",
      });
    }

    const token = jwt.sign({ userId: foundUser._id }, JWT_SECRET_STR);

    res.status(200).json({
      message: "user logged-in successfully",
      token,
    });
  } catch (e) {
    console.error(
      `[${req.method} ${req.path}] userId=${
        req.userId || "N/A"
      } body=${JSON.stringify(req.body)} Error:`,
      e
    );

    res.status(500).json({
      error: "Error Logging in!",
    });
  }
});

userRouter.get("/brain/:hash", async (req, res) => {
  try {
    const foundContent = await LinkModel.findOne({
      hash: req.params.hash,
    })
      .populate({
        path: "contentId",
        select: "link type title linkText tags",
      })
      .lean()
      .exec();

    if (!foundContent) {
      return res.status(404).json({ error: "Content not found!" });
    }

    res.status(200).json({
      message: foundContent,
    });
  } catch (e) {
    console.error(
      `[${req.method} ${req.path}] userId=${
        req.userId || "N/A"
      } body=${JSON.stringify(req.body)} Error:`,
      e
    );

    res.status(500).json({
      error: "Error fetching shared content!",
    });
  }
});

userRouter.use(userMiddleware);

type ContentSchemaType = z.infer<typeof schemaContent>;

userRouter.post("/content", async (req, res) => {
  const ValidContent = schemaContent.safeParse(req.body);

  if (ValidContent.success) {
    try {
      const { link, type, title, tags, linkText }: ContentSchemaType =
        ValidContent.data;

      const userId = req.userId;

      const content = await ContentModel.findOne({
        title,
        userId,
      });

      if (content) {
        return res.status(400).json({
          error:
            "Content with this title already exists. Please choose another title...!",
        });
      }

      const tagArray = tags.split(",");

      const existingTags = await TagModel.find({ title: { $in: tagArray } });
      const existingTagNames = existingTags.map((tag) => tag.title);

      const newTagNames = tagArray.filter(
        (tag: string) => !existingTagNames.includes(tag)
      );

      const newTags = await TagModel.insertMany(
        newTagNames.map((title: string) => ({ title }))
      );

      const allTagIds = [
        ...existingTags.map((t) => t._id),
        ...newTags.map((t) => t._id),
      ];

      await ContentModel.create({
        link,
        type,
        title,
        tags: allTagIds,
        linkText,
        userId,
      });

      res.status(201).json({
        message: "content created successfully!",
      });
    } catch (e) {
      console.error(
        `[${req.method} ${req.path}] userId=${
          req.userId || "N/A"
        } body=${JSON.stringify(req.body)} Error:`,
        e
      );

      res.status(500).json({
        error: "Error Creating Content!",
      });
    }
  } else {
    res.status(400).json({ error: ValidContent.error.issues });
  }
});

userRouter.get("/contents", async (req: Request, res: Response) => {
  await getContents(req, res);
});

userRouter.get("/contents/:type", async (req: Request, res: Response) => {
  await getContents(req, res);
});

async function getContents(req: Request, res: Response) {
  try {
    const filter: { userId?: string | undefined; type?: string } = {
      userId: req.userId,
    };

    if (req.params.type) {
      filter.type = req.params.type;
    }

    const userContents = await ContentModel.find(filter)
      .populate("tags", "title")
      .lean();

    if (userContents.length === 0) {
      return res.status(200).json({ message: "No Contents Found!" });
    }

    const formattedContents = userContents.map((content) => ({
      ...content,
      tags: Array.isArray(content.tags)
        ? content.tags.map((tag) =>
            typeof tag === "object" && "title" in tag ? tag.title : tag
          )
        : [],
    }));

    res.status(200).json({ message: formattedContents });
  } catch (e) {
    console.error("Error fetching contents:", e);
    res.status(500).json({ error: "Error Fetching Contents!" });
  }
}

userRouter.put("/update-content", async (req, res) => {
  const ValidContent = schemaContent.safeParse(req.body);

  if (ValidContent.success) {
    try {
      const {
        contentId,
        link,
        type,
        title,
        tags,
        linkText,
      }: ContentSchemaType = ValidContent.data;

      const foundContent = await ContentModel.findById(contentId);

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

      const tagArray = tags.split(",");

      const existingTags = await TagModel.find({ title: { $in: tagArray } });
      const existingTagNames = existingTags.map((tag) => tag.title);

      const newTagNames = tagArray.filter(
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
        linkText,
        tags: allTagIds,
        userId,
      });

      res.status(201).json({
        message: "content updated successfully!",
      });
    } catch (e) {
      console.error(
        `[${req.method} ${req.path}] userId=${
          req.userId || "N/A"
        } body=${JSON.stringify(req.body)} Error:`,
        e
      );

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

    const foundContent = await ContentModel.findById(contentId);

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
    console.error(
      `[${req.method} ${req.path}] userId=${
        req.userId || "N/A"
      } body=${JSON.stringify(req.body)} Error:`,
      e
    );

    res.status(500).json({
      error: "Error Deleting Content!",
    });
  }
});

userRouter.post("/share", async (req, res) => {
  try {
    const { contentId, share } = req.body;

    const foundContent = await ContentModel.findById(contentId);

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
        hash: crypto.randomBytes(10).toString("hex"),
        contentId,
        userId: req.userId,
      });

      res.status(201).json({
        message: "content shared successfully",
        hash: sharedLink.hash,
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
    console.error(
      `[${req.method} ${req.path}] userId=${
        req.userId || "N/A"
      } body=${JSON.stringify(req.body)} Error:`,
      e
    );

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
    console.error(
      `[${req.method} ${req.path}] userId=${
        req.userId || "N/A"
      } body=${JSON.stringify(req.body)} Error:`,
      e
    );

    res.status(500).json({
      error: "Error fetching user",
    });
  }
});

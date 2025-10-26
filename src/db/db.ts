import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const TagSchema = new Schema(
  {
    title: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

const LinkSchema = new Schema(
  {
    hash: { type: String, required: true, unique: true },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "contents",
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const contentTypes = ["image", "video", "article", "audio"];

const ContentSchema = new Schema(
  {
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tags" }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

ContentSchema.index({ userId: 1, title: 1 }, { unique: true });

export const UserModel = mongoose.model("users", UserSchema);
export const TagModel = mongoose.model("tags", TagSchema);
export const LinkModel = mongoose.model("links", LinkSchema);
export const ContentModel = mongoose.model("contents", ContentSchema);

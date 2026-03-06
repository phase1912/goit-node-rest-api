import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import authService from "../services/authService.js";
import HttpError from "../helpers/HttpError.js";

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.registerUser({ email, password });
  return res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  if (!result) {
    throw HttpError(401, "Email or password is wrong");
  }
  return res.status(200).json({
    token: result.token,
    user: {
      email: result.user.email,
      subscription: result.user.subscription,
      avatarURL: result.user.avatarURL,
    },
  });
};

export const logoutUser = async (req, res) => {
  const { id } = req.user;
  const user = await authService.logoutUser(id);
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  return res.status(204).send();
};

export const getCurrentUser = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  return res.status(200).json({
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  });
};

export const verifyUser = async (req, res) => {
  const { verificationToken } = req.params;
  await authService.verifyUser(verificationToken);
  return res.status(200).json({
    message: "Verification successful",
  });
};

export const resendVerify = async (req, res) => {
  const { email } = req.body;
  await authService.resendVerify({ email });
  return res.status(200).json({
    message: "Verification email sent",
  });
};

export const updateAvatar = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }

  const avatarsDir = path.join(process.cwd(), "public", "avatars");
  await fs.mkdir(avatarsDir, { recursive: true });
  const ext = path.extname(req.file.originalname) || ".jpg";
  const filename = `${user.id}-${uuidv4()}${ext}`;
  const destPath = path.join(avatarsDir, filename);
  await fs.rename(req.file.path, destPath);
  const avatarURL = `/avatars/${filename}`;

  const updatedUser = await authService.updateUserAvatar(user.id, avatarURL);
  if (!updatedUser) {
    throw HttpError(401, "Not authorized");
  }
  return res.status(200).json({
    email: user.email,
    subscription: user.subscription,
    avatarURL: updatedUser.avatarURL,
  });
};
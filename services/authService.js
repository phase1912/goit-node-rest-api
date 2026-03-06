import bcrypt from "bcrypt";
import gravatar from "gravatar";
import { v4 as uuidv4 } from "uuid";
import User from "../db/models/user.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwtToken.js";
import sendEmail from "../helpers/sendEmail.js";

const BASE_URL = process.env.BASE_URL;

const createVerifyEmail = ({ to, verificationCode })=> ({
  to,
  subject: "Verify email",
  html: `<a href="${BASE_URL}/api/auth/verify/${verificationCode}" target="_blank">Click verify email</a>`,
})

const findUser = async ({ id }) => {
  const user = await User.findByPk(id);
  return user;
};

const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();
  const avatarURL = gravatar.url(email, { s: "200", d: "identicon", protocol: "https" });
  const newUser = await User.create({
    email,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = createVerifyEmail({ to: newUser.email, verificationCode: newUser.verificationToken });
  await sendEmail(verifyEmail);
  return newUser;
};

export const resendVerify = async ({ email }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw HttpError(404, "User not found");
  if (user.verify) throw HttpError(400, "Verification has already been passed");
  const verifyEmail = createVerifyEmail({ to: user.email, verificationCode: user.verificationToken });
  await sendEmail(verifyEmail);
};

export const verifyUser = async (verificationToken) => {
  const user = await User.findOne({ where: { verificationToken } });
  if (!user) throw HttpError(404, "User not found");
  await user.update({ verify: true, verificationToken: null });
  return user;
};

const loginUser = async ({ email, password }) => {
  const foundUser = await User.findOne({ where: { email } });
  if (!foundUser) {
    return null;
  }
  const isPasswordValid = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordValid) {
    return null;
  }
  if(!foundUser.verify) throw HttpError(401, "Email not verified");
  const token = createToken({ id: foundUser.id });
  await foundUser.update({ token });
  return { token, user: foundUser };
};

const logoutUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        return null;
    }
    await user.update({ token: null });
    return user;
};

const updateUserAvatar = async (id, avatarURL) => {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  await user.update({ avatarURL });
  return user;
};

export default { registerUser, loginUser, logoutUser, findUser, updateUserAvatar, verifyUser, resendVerify };
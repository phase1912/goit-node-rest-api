import bcrypt from "bcrypt";
import User from "../db/models/user.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwtToken.js";

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
  const newUser = await User.create({
    email,
    password: hashedPassword,
  });
  return newUser;
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

export default { registerUser, loginUser, logoutUser, findUser };
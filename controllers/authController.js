import authService from "../services/authService.js";
import HttpError from "../helpers/HttpError.js";

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.registerUser({ email, password });
  return res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
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
  });
};
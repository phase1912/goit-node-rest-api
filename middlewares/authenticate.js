import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwtToken.js";
import authService from "../services/authService.js";

const UNAUTHORIZED_MESSAGE = "Not authorized";

const authenticate = async (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    throw HttpError(401, UNAUTHORIZED_MESSAGE);
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    throw HttpError(401, UNAUTHORIZED_MESSAGE);
  }

  const { data, error } = verifyToken(token);
  if (error) {
    throw HttpError(401, UNAUTHORIZED_MESSAGE);
  }

  const user = await authService.findUser({ id: data.id });
  if (!user) {
    throw HttpError(401, UNAUTHORIZED_MESSAGE);
  }
  if (user.token !== token) {
    throw HttpError(401, UNAUTHORIZED_MESSAGE);
  }

  req.user = user;
  next();
};

export default authenticate;
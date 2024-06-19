import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "user created" });
};
export const login = async (req, res) => {
  console.log("req body", req.body);
  const user = await User.findOne({ username: req.body.username });

  console.log("user", user);

  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));

  console.log("isValidUser", isValidUser);

  if (!isValidUser) throw new UnauthenticatedError("invalid credentials");

  const token = createJWT({ userId: user._id, role: user.role });

  // const oneDay = 1000 * 60 * 60 * 24;

  // res.cookie("token", token, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + oneDay),
  //   secure: process.env.NODE_ENV === "production",
  // });
  res.status(StatusCodes.OK).json(token);
};

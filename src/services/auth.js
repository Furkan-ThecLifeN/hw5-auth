import createError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import crypto from "crypto";

export const registerUser = async (userData) => {
  const { email, password, name } = userData;
  const user = await User.findOne({ email });

  if (user) {
    throw createError(409, "Email in use");
  }

  const newUser = await User.create({ name, email, password });
  return newUser;
};

export const loginUser = async (userData) => {
  const { email, password } = userData;
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(401, "Invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw createError(401, "Invalid credentials");
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(32).toString("hex");
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 gün

  const newSession = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return newSession;
};

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createError(401, "Session not found");
  }

  if (new Date() > session.refreshTokenValidUntil) {
    await Session.deleteOne({ _id: session._id });
    throw createError(401, "Refresh token expired");
  }

  await Session.deleteOne({ _id: session._id });

  const newAccessToken = crypto.randomBytes(32).toString("hex");
  const newRefreshToken = crypto.randomBytes(32).toString("hex");
  const newAccessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const newRefreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const newSession = await Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: newAccessTokenValidUntil,
    refreshTokenValidUntil: newRefreshTokenValidUntil,
  });

  return newSession;
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }
  await Session.deleteOne({ refreshToken });
};
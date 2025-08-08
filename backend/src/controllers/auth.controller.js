import { SECRET_JWT_KEY, SECRET_JWT_REFRESH_KEY } from "../config/variables.js";
import { AuthRepository } from "../database/repository/auth.repository.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password, username, display_name } = req.body;

  try {
    await AuthRepository.register({ email, password, username, display_name });
    res.send("User register!");
  } catch (error) {
    res.status(201).send(error.message);
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userId = await AuthRepository.login({ username, password });
    const accessToken = jwt.sign({ userId }, SECRET_JWT_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, SECRET_JWT_REFRESH_KEY, {
      expiresIn: "7d",
    });

    await AuthRepository.saveRefreshToken({ userId, refreshToken });

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .send({ userId });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refresh_token;

  if (!token) return res.status(401).send("No refresh token");

  try {
    const payload = jwt.verify(token, SECRET_JWT_REFRESH_KEY);

    await AuthRepository.searchRefreshToken({
      userId: payload.userId,
      refreshToken: token,
    });

    const newRefreshToken = jwt.sign(
      { userId: payload.userId },
      SECRET_JWT_REFRESH_KEY,
      {
        expiresIn: "7d",
      }
    );

    await AuthRepository.updateRefreshToken({
      newRefreshToken,
      userId: payload.userId,
      refreshToken: token,
    });

    const newAccessToken = jwt.sign(
      { userId: payload.userId },
      SECRET_JWT_KEY,
      {
        expiresIn: "15m",
      }
    );

    res
      .cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      })
      .send({ accessToken: newAccessToken });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.refresh_token;

  await AuthRepository.deleteSessionUser({ token });

  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.send("Sesión cerrada");
};

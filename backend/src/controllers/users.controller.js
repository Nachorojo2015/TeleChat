import { UsersRepository } from "../database/repository/users.repository.js";

export const getMyUser = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await UsersRepository.getMyUser({ userId });
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const blockUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    await UsersRepository.blockUser({ userId, blockedId: id })
    res.send('Usuario bloqueado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const unlockUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    await UsersRepository.unlockUser({ userId, blockedId: id })
    res.send('Usuario desbloqueado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const getUsersByUsername = async (req, res) => {
  const { username } = req.params;
  const { userId } = req.user;

  try {
    const users = await UsersRepository.getUsersByUsername({ username, userId })
    res.send(users)
  } catch (error) {
    res.status(400).send(error.message)
  }
}
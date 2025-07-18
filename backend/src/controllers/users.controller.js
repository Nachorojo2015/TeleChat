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

export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UsersRepository.getUser({ userId: id })
    res.send(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

import { PrivateChatsRepository } from "../database/repository/privateChats.repository.js";

export const createPrivateChat = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  try {
    const privateChatId = await PrivateChatsRepository.createPrivateChat({ userId, privateUser: id });
    res.send(privateChatId);
  } catch (error) {
    res.status(201).send(error.message);
  }
};

export const getPrivateChat = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const privateChat = await PrivateChatsRepository.getPrivateChat({ privateChatId: id, userId });
    res.send(privateChat);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
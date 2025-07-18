import { ChatsRepository } from "../database/repository/chats.repository.js";

export const getChats = async (req, res) => {
  const { userId } = req.user;

  try {
    const chats = await ChatsRepository.getChats({ userId });
    res.send(chats);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await ChatsRepository.getChat({ chatId });
    res.send(chat)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

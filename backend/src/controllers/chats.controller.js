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

export const deleteChat = async (req, res) => {
  const { id } = req.params;

  try {
    await ChatsRepository.deleteChat({ chatId: id });
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
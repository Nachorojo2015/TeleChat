import { MessagesRepository } from "../database/repository/messages.repository.js";

export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await MessagesRepository.getMessages({ chatId });
    res.send(messages);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createMessage = async (req, res) => {
  const file = req.file;
  const { chatId } = req.params;
  const { userId } = req.user;
  const { replyId, content, type, forwardedId } = req.body;

  try {
    const message = await MessagesRepository.createMessage({ userId, chatId, replyId, content, type, fileUrl: file, forwardedId })
    res.send({ message });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    await MessagesRepository.deleteMessage({ messageId })
    res.send('Mensaje borrado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    await MessagesRepository.editMessage({ messageId, content })
    res.send('Mensaje editado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}


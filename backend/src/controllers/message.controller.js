import { MessagesRepository } from "../database/repository/messages.repository.js";

export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await MessagesRepository.getMessages({ chatId });
    res.send(messages);
  } catch (error) {
    res.status(201).send(error.message);
  }
};

export const createMessage = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.user;
  const { replyId, content, type, fileUrl, forwardedId } = req.body;

  try {
    await MessagesRepository.createMessage({ userId, chatId, replyId, content, type, fileUrl, forwardedId })
    res.send('Mensaje creado')
  } catch (error) {
    res.status(201).send(error.message)
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

export const pinMessage = async (req, res) => {
  const { messageId, chatId } = req.params;
  const { userId } = req.user; 

  try {
    await MessagesRepository.pinMessage({ messageId, chatId, userId })
    res.send('Mensaje fijado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const viewMessage = async (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.user;

  try {
    await MessagesRepository.viewMessage({ messageId, userId })
    res.send('Mensaje visto')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const reactMessage = async (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.user;
  const { reaction } = req.body;

  try {
    await MessagesRepository.reactMessage({ messageId, userId, reaction })
    res.send('Mensaje reaccionado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}


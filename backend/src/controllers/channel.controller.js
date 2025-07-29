import { ChannelsRepository } from "../database/repository/channels.repository.js";

export const createChannel = async (req, res) => {
  const file = req.file;
  const { title } = req.body;
  const { userId } = req.user;

  try {
    await ChannelsRepository.createChannel({ title, picture: file, userId })
    res.send('Canal creado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const getChannel = async (req, res) => {
    const { id } = req.params;

    try {
      const channel = await ChannelsRepository.getChannel({ channelId: id })
      res.send(channel)
    } catch (error) {
      res.status(400).send(error.message)
    }
}

export const joinChannel = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    await ChannelsRepository.joinChannel({ channelId: id, userId})
    res.send('Te uniste al canal')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const getOut = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    await ChannelsRepository.getOut({ channelId: id, userId })
    res.send('Saliste del canal')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const editChannel = async (req, res) => {
   const file = req.file;
   const { id } = req.params;
   const { title, description, is_public } = req.body;
 
   try {
     await ChannelsRepository.editChannel({ channelId: id, title, description, picture: file, is_public })
     res.send('Canal editado')
   } catch (error) {
     res.status(201).send(error.message)
   }
}

export const deleteChannel = async (req, res) => {
  const { id } = req.params;

  try {
    await ChannelsRepository.deleteChannel({ channelId: id })
    res.send('Canal eliminado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}
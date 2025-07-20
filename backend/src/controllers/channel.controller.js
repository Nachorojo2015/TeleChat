import { ChannelsRepository } from "../database/repository/channels.repository.js";

export const getChannel = async (req, res) => {
    const { id } = req.params;

    try {
      const channel = await ChannelsRepository.getChannel({ channelId: id })
      res.send(channel)
    } catch (error) {
        res.status(400).send(error.message)
    }
}
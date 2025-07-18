import { GroupsRepository } from "../database/repository/groups.repository.js";

export const createGroup = async (req, res) => {
  const { userId } = req.user;
  const { members, picture, title } = req.body;

  try {
    await GroupsRepository.createGroup({ members, picture, title, userId });
    res.send("Group created");
  } catch (error) {
    res.status(201).send(error.message);
  }
};

export const getGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await GroupsRepository.getGroup({ groupId: id });
    res.send(group);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

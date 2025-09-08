import { GroupsRepository } from "../database/repository/groups.repository.js";

export const createGroup = async (req, res) => {
  const file = req.file;
  const { userId } = req.user;
  const { title } = req.body;

  try {
    const groupId = await GroupsRepository.createGroup({ picture: file, title, userId });
    res.send({ groupId });
  } catch (error) {
    res.status(201).send(error.message);
  }
};

export const getGroup = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const group = await GroupsRepository.getGroup({ groupId: id, userId });
    res.send(group);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getOut = async (req, res) => {
  const { id } = req.params
  const { userId } = req.user;

  try {
    await GroupsRepository.getOut({ userId, groupId: id })
    res.send('Afuera')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const editGroup = async (req, res) => {
  const file = req.file;
  const { id } = req.params;
  const { title, description, is_public } = req.body;

  try {
    const groupData = await GroupsRepository.editGroup({ groupId: id, title, description, picture: file, is_public })
    res.send({ groupData })
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const joinGroup = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    await GroupsRepository.joinGroup({ groupId: id, userId })
    res.send('Te uniste al grupo')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const getGroupsByName = async (req, res) => {
  const { name } = req.params;

  console.log('Buscando grupos por nombre:', name);

  try {
    const groups = await GroupsRepository.getGroupsByName({ name });
    res.send(groups);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const getMembers = async (req, res) => {
  const { id } = req.params;

  console.log("Fetching members for group ID:", id);

  try {
    const members = await GroupsRepository.getMembers({ groupId: id });
    res.send({ members });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}


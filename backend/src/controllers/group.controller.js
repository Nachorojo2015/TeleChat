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

export const deleteGroup = async (req, res) => {
  const { id } = req.params;

  try {
    await GroupsRepository.deleteGroup({ groupId: id })
    res.send('Grupo eliminado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const editGroup = async (req, res) => {
  const file = req.file;
  const { id } = req.params;
  const { title, description, is_public } = req.body;

  try {
    await GroupsRepository.editGroup({ groupId: id, title, description, picture: file, is_public })
    res.send('Grupo editado')
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

export const addMember = async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    await GroupsRepository.addMember({ groupId, userId })
    res.send('Miembro agregado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const removeMember = async (req, res) => {
  const { groupId, userId } = req.params;
  
  try {
    await GroupsRepository.removeMember({ groupId, userId })
    res.send('Miembro eliminado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const banMember = async (req, res) => {
  const { groupId, userBanId } = req.params;
  const { userId } = req.user;

  try {
    await GroupsRepository.banMember({ groupId, userBanId, userId })
    res.send('Baneado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const unbanMember = async (req, res) => {
  const { groupId, userBanId } = req.params;

  try {
    await GroupsRepository.unbanMember({ groupId, userId: userBanId })
    res.send('Miembro desbaneado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const muteMember = async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    await GroupsRepository.muteMember({ groupId, userId })
    res.send('Miembro muteado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const unmuteMember = async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    await GroupsRepository.unmuteMember({ groupId, userId })
    res.send('Miembro desmuteado')
  } catch (error) {
    res.status(201).send(error.message)
  }
}

export const becomeMemberAdmin = async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    await GroupsRepository.becomeMemberAdmin({ groupId, userId })
    res.send('Miembro admin')
  } catch (error){
    res.status(201).send(error.message)
  }
}

export const becomeMember = async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    await GroupsRepository.becomeMember({ groupId, userId })
    res.send('Usuario miembro')
  } catch (error){
    res.status(201).send(error.message)
  }
}

export const getGroupsByName = async (req, res) => {
  const { name } = req.params;

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


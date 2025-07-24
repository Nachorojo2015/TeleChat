import { GroupsRepository } from "../database/repository/groups.repository.js";

export const createGroup = async (req, res) => {
  const { userId } = req.user;
  const { members, picture, title } = req.body;

  try {
    await GroupsRepository.createGroup({ members, picture, title, userId });
    res.send("Grupo creado");
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
  const { id } = req.params;
  const { title, description, picture, is_public } = req.body;

  try {
    await GroupsRepository.editGroup({ groupId: id, title, description, picture, is_public })
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



export const createEntry = async (parent, {
  title,
  type,
  body,
  occursAt,
}, { models, me }) => {
  try {
    return await models.Entry.create({
      title,
      ...(type && { type }),
      ...(body && { body }),
      ...(occursAt && { occursAt }),
      UserId: me.id,
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const editEntry = async (parent, {
  id,
  title,
  type,
  body,
  occursAt,
  completedAt,
}, { models }) => {
  try {
    const entry = await models.Entry.findByPk(id);
    if (!entry) throw new Error('Entry not found.');
    entry.update({
      ...(title && { title }),
      ...(type && { type }),
      ...(body && { body }),
      ...(occursAt && { occursAt }),
      ...(completedAt && { completedAt }),
    }, { where: { id } });

    return entry;
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteEntry = async (parent, { id }, { models }) => {
  try {
    const deleted = await models.Entry.destroy({ where: { id } });
    return deleted > 0;
  } catch (err) {
    throw new Error(err);
  }
};

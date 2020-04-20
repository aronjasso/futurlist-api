import { Op } from 'sequelize';

import { toCursorHash, fromCursorHash } from '../../utils/cursorHash';
import getISODayRange from '../../utils/getISODayRange';

export const getEntry = async (parent, { id }, { models }) => {
  try {
    const entry = await models.Entry.findByPk(id);
    if (!entry) return new Error('Entry not found.');

    return entry;
  } catch (err) {
    throw new Error(err);
  }
};

export const getEntries = async (parent, {
  search,
  filter,
  cursor,
  limit = 20,
}, { models, me }) => {
  const cursorOptions = cursor && {
    createdAt: { [Op.lt]: fromCursorHash(cursor) },
  };

  const searchOptions = search && {
    [Op.or]: [
      { title: { [Op.iLike]: `%${search}%` } },
      { body: { [Op.iLike]: `%${search}%` } },
    ],
  };

  const filterOptions = filter && {
    [Op.and]: [
      ...('type' in filter ? [{ type: { [Op.eq]: filter.type } }] : []),
      ...('priority' in filter ? [
        { priority: { [Op.eq]: filter.priority } },
      ] : []),
      ...('occursAt' in filter ? [{
        occursAt: { [Op.between]: getISODayRange(filter.occursAt) },
      }] : []),
      ...('completedAt' in filter ? [{
        completedAt: { [Op.between]: getISODayRange(filter.completedAt) },
      }] : []),
    ],
  };

  try {
    const entries = await models.Entry.findAll({
      order: [['createdAt', 'DESC']],
      limit: limit + 1,
      where: {
        UserId: me.id,
        ...cursorOptions,
        ...searchOptions,
        ...filterOptions,
      },
    });

    const hasNextPage = entries.length > limit;
    const edges = hasNextPage ? entries.slice(0, -1) : entries;
    const lastEdge = edges[edges.length - 1] || {};
    const endCursor = toCursorHash(
      (lastEdge.createAt || '').toString(),
    );

    return {
      edges,
      pageInfo: {
        hasNextPage,
        endCursor,
      },
    };
  } catch (err) {
    throw new Error(err);
  }
};

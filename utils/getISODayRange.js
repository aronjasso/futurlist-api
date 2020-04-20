import moment from 'moment';

const getISODayRange = (date) => {
  if (!date) return [];
  const start = moment(date).startOf('day');
  const end = moment(date).endOf('day');
  return [start.toISOString(), end.toISOString()];
};

export default getISODayRange;

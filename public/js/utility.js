// convert time to 12hr format
export const convertTime = time => {
  let hours = time.split(':')[0];
  let minutes = time.split(':')[1];
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
};

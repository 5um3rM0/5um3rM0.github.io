export function isSpecialBirthday() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  //return month === 8 && day === 28;
  return true;
}
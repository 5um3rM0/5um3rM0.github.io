/**
 * 根据当前月份获取季节的名称
 * @returns {string|null} 返回 'spring', 'summer', 'autumn', 'winter' 或 null
 */
export function getCurrentSeason() {
  const month = new Date().getMonth() + 1; // 获取当前月份 (1-12)

  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  if (month === 12 || month === 1 || month === 2) return 'winter';

  return null;
}
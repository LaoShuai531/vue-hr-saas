/**
 * 手动校验规则的文件
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
/**
 * 校验手机号的方法
**/
export function validMobile(str) {
  return /^1[3-9]\d{9}$/.test(str)
}

import Cookies from 'js-cookie'

const TokenKey = 'hr-saas-cwj-token' // 只要保证这个key唯一性就行

const timeKey = 'hr-sass-time-key' // 用来作为时间戳存储的key，同时确保独一无二

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 设置时间戳
export function setTimeStamp() {
  // 设置当前最新的时间戳
  // Date.now()  new Date.getTime()
  Cookies.set(timeKey, Date.now())
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}

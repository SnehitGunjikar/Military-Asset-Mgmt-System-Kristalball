const TOKEN_KEY = 'mas_token'
const USER_KEY = 'mas_user'
const ROLE_KEY = 'mas_role'

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t) => localStorage.setItem(TOKEN_KEY, t),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  },
  setUser: (u) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  getRole: () => localStorage.getItem(ROLE_KEY),
  setRole: (r) => localStorage.setItem(ROLE_KEY, r),
  removeRole: () => localStorage.removeItem(ROLE_KEY),

  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(ROLE_KEY)
  },
}
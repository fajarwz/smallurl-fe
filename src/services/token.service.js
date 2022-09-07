class TokenService {
  getLocalAccessToken() {
    try {
      const parsedUser = JSON.parse(localStorage.getItem("user"));
      return parsedUser.access_token.token;
    } catch(e) {
      return false
    }
  }
  updateLocalAccessToken(accessToken) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.access_token = accessToken;
    localStorage.setItem("user", JSON.stringify(user));
  }
  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  removeUser() {
    localStorage.removeItem("user");
  }
}
export default new TokenService();
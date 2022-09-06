class TokenService {
  getLocalAccessToken() {
    // console.log(typeof localStorage.getItem("user"))
    // const user = localStorage.getItem("user") !== "null" || localStorage.getItem("user") !== "undefined" ? localStorage.getItem("user") : null ;
    // console.log(user);
    // console.log(parsedUser);
    
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
    console.log("token refreshed", accessToken);
  }
  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  setUser(user) {
    console.log(JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
  }
  removeUser() {
    localStorage.removeItem("user");
  }
}
export default new TokenService();
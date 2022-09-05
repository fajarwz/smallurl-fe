import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    if (userToken === "null") {
      localStorage.removeItem("token");
      setToken(null);
    } 
    else {
      localStorage.removeItem("token");
      localStorage.setItem("token", JSON.stringify(userToken));
      console.log("set token success", userToken);
      setToken(userToken);
    }
  };

  return {
    setToken: saveToken,
    token,
  };
}

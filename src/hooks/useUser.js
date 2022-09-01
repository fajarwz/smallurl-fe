import { useState } from "react";

export default function useUser() {
  const getUser = () => {
    const userString = localStorage.getItem("user");
    const userData = JSON.parse(userString);
    return userData;
  };

  const [user, setUser] = useState(getUser());

  const saveUser = (user) => {
    if (user === "null") {
      localStorage.removeItem("user");
      setUser(null);
    } 
    else {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    }
  };

  return {
    setUser: saveUser,
    user,
  };
}

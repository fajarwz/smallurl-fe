import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useRedirectIfAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("redirect if auth", token);

    const auth = token !== null && token !== "null" ? true : false;
    console.log("redirect if auth", auth);

    if (auth) navigate("/user");
  }, []);
};

export default useRedirectIfAuth;

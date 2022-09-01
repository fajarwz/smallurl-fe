import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAuthGuard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("auth guard", token);

    const auth = token !== null && token !== "null" ? true : false;
    console.log("auth guard", auth);

    if (!auth) navigate("/login");
  }, []);
};

export default useAuthGuard;

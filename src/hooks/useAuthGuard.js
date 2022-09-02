import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useToken from "./useToken";

const useAuthGuard = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  // console.log(token);

  useEffect(() => {
    let auth = false;

    if (token !== null || token !== "null") {
      const isTokenExpired = new Date() > new Date(token.expires_in * 1000);

      if (!isTokenExpired)
        auth = true;
    }

    // console.log("auth", auth);

    if (!auth) navigate("/login");
  }, [token, navigate]);
};

export default useAuthGuard;

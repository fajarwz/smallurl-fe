import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useToken from "./useToken";

const useRedirectIfAuth = () => {
  const navigate = useNavigate();
  const { token, setToken } = useToken();

  useEffect(() => {
    let auth = false;

    if (token !== null && token !== "null") {
      const isTokenExpired = new Date() > new Date(token.expires_in * 1000);

      if (!isTokenExpired)
        auth = true;
    }

    if (auth) navigate("/user");
  }, []);
};

export default useRedirectIfAuth;

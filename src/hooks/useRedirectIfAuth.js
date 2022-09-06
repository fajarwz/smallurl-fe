import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useToken from "./useToken";
import tokenService from "../services/token.service";

const useRedirectIfAuth = () => {
  const navigate = useNavigate();
  const token = tokenService.getLocalAccessToken();

  useEffect(() => {
    let auth = false;

    if (token !== null && token !== "null" && token !== "undefined" && token !== false) {
      auth = true;
    }

    if (auth) navigate("/user");
  }, []);
};

export default useRedirectIfAuth;

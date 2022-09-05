import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useToken from "./useToken";

const useAuthGuard = () => {
  const navigate = useNavigate();
  const { token, setToken } = useToken();
  console.log("get token", token);

  useEffect(() => {
    const getNewToken = async () => {
      const getNewTokenReq = await fetch(
        `${process.env.REACT_APP_API_HOST}/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token.token}`,
          },
        }
      );

      const getNewTokenRes = await getNewTokenReq.json();
      console.log('getNewToken', getNewTokenRes);

      if (getNewTokenRes.meta.code === 200) {
        setToken(getNewTokenRes.data.access_token);
      } else {
        console.log(getNewTokenRes.meta.message);
      }
    }

    let auth = false;

    if (token !== null || token !== "null") {
      auth = true;
      
      const isTokenExpired = new Date() > new Date(token.expires_in * 1000);

      if (isTokenExpired) {
        getNewToken();
      }
    }

    if (!auth) navigate("/login");
  }, [token, setToken, navigate]);
};

export default useAuthGuard;

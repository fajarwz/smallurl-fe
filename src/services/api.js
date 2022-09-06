import axios from "axios";
import tokenService from "./token.service";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_HOST,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = tokenService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token; 
    }
    return config;
  },
  (error) => {
    return error;
  }
);
api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    
    console.log(err);

    const globalUrl = [
      `/login`,
      `/register`,
    ];

    if (!globalUrl.includes(originalConfig.url) && err.response) {
      console.log("Access Token was expired");
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await api.post("/refresh");
          const data = rs.data;
      
          tokenService.updateLocalAccessToken(data.data.access_token);

          return api(originalConfig);
        } catch (_error) {
          return _error;
        }
      }
    }
    return err.response;
  }
);
export default api;
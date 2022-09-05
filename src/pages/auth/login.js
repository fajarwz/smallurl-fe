import "../../assets/css/output.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useToken from "../../hooks/useToken";
import useUser from "../../hooks/useUser";
import useRedirectIfAuth from "../../hooks/useRedirectIfAuth";
import Input from "../../components/Input";
import SubmitBtn from "../../components/SubmitBtn";
import InputError from "../../components/InputError";
import Notification from "../../components/Notification";
import api from "../../services/api";
import tokenService from "../../services/token.service";

const Login = () => {
  useRedirectIfAuth();

  const { setToken } = useToken();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState([]);
  const [passwordError, setPasswordError] = useState([]);
  const [generalError, setGeneralError] = useState([]);
  const navigate = useNavigate();

  function fieldHandler(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function loginHandler(e) {
    e.preventDefault();
    setGeneralError([]);
    setEmailError([]);
    setPasswordError([]);
    setLoading(true);

    const loginReq = await api.post(`${process.env.REACT_APP_API_HOST}/login`, {
      email: form.email,
      password: form.password,
    });

    console.log(loginReq);

    setLoading(false);

    const loginRes = await loginReq.data;

    if (loginRes.meta.code === 200) {
      // setUser(loginRes.data.user);
      // setToken(loginRes.data.access_token);
      tokenService.setUser(loginRes.data);
      navigate("/user");
    } else {
      console.log(loginRes.meta.message);
      setGeneralError(loginRes.meta.message.general ?? []);
      setEmailError(loginRes.meta.message.email ?? []);
      setPasswordError(loginRes.meta.message.password ?? []);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container flex flex-col justify-center items-center">
        <div className="text-center">
          <h1>SmallUrl</h1>
          <p>Please login to continue</p>
        </div>
        <div className="mb-8">
          {generalError.length > 0 && <Notification isError={generalError.length > 0} messages={generalError} />}
          <form onSubmit={loginHandler}>
            <div className="mb-2">
              <Input
                name="email"
                value={form.email}
                placeholder="Email"
                fieldHandler={fieldHandler}
                isError={emailError.length > 0}
              />
              <InputError errors={emailError} />
            </div>
            <div className="mb-4">
              <Input
                type="password"
                value={form.password}
                name="password"
                placeholder="Password"
                fieldHandler={fieldHandler}
                isError={passwordError.length > 0}
              />
              <InputError errors={passwordError} />
            </div>
            <div className="flex flex-row items-center justify-between">
              <Link to="/">Back to Home</Link>
              <SubmitBtn name={"Login"} loading={loading} />
            </div>
          </form>
        </div>
        <div className="">
          Need an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

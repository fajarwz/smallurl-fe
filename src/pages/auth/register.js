import "../../assets/css/output.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useToken from "../../hooks/useToken";
import useUser from "../../hooks/useUser";
import useRedirectIfAuth from "../../hooks/useRedirectIfAuth";
import Notification from "../../components/Notification";
import Input from "../../components/Input";
import InputError from "../../components/InputError";
import SubmitBtn from "../../components/SubmitBtn";
import api from "../../services/api";
import tokenService from "../../services/token.service";

const Register = () => {
  useRedirectIfAuth();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [emailError, setEmailError] = useState([]);
  const [passwordError, setPasswordError] = useState([]);
  const [nameError, setNameError] = useState([]);
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
    setNameError([]);
    setLoading(true);

    const registerReq = await api.post(
      `${process.env.REACT_APP_API_HOST}/register`, {
        email: form.email,
        password: form.password,
        name: form.name,
      }
    );

    setLoading(false);

    const registerRes = await registerReq.data;
    console.log(registerRes);

    if (registerRes.meta.code === 200) {
      tokenService.setUser(registerRes.data);
      navigate("/user");
    } else {
      console.log(registerRes.meta.message);
      setGeneralError(registerRes.meta.message.general ?? []);
      setEmailError(registerRes.meta.message.email ?? []);
      setPasswordError(registerRes.meta.message.password ?? []);
      setNameError(registerRes.meta.message.name ?? []);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container flex flex-col justify-center items-center">
        <div className="text-center">
          <h1>SmallUrl</h1>
          <p>Create an account to get your custom URL</p>
        </div>
        <div className="mb-8">
          {generalError.length > 0 && (
            <Notification
              isError={generalError.length > 0}
              messages={generalError}
            />
          )}
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
            <div className="mb-2">
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
            <div className="mb-4">
              <Input
                value={form.name}
                name="name"
                placeholder="Name"
                fieldHandler={fieldHandler}
                isError={nameError.length > 0}
              />
              <InputError errors={nameError} />
            </div>
            <div className="flex flex-row items-center justify-between">
              <Link to="/">Back to Home</Link>
              <SubmitBtn name={"Register"} loading={loading} />
            </div>
          </form>
        </div>
        <div className="">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

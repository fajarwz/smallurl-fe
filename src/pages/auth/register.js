import "../../assets/css/output.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useToken from "../../hooks/useToken";
import useUser from "../../hooks/useUser";
import useRedirectIfAuth from "../../hooks/useRedirectIfAuth";

const Register = (props) => {
  const redirectIfAuth = useRedirectIfAuth();

  const { token, setToken } = useToken();
  const [message, setMessage] = useState("");
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();

  function fieldHandler(e) {
    const name = e.target.getAttribute("name");

    setForm({
      ...form,
      [name]: e.target.value,
    });
  }

  async function loginHandler(e) {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const registerReq = await fetch(`${process.env.REACT_APP_API_HOST}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: data.get("email"),
        password: data.get("password"),
        name: data.get("name"),
      }),
    });

    setLoading(false);

    const registerRes = await registerReq.json();
    console.log(registerRes);

    if (registerRes.meta.code === 200) {
      setUser(registerRes.data.user);
      setToken(registerRes.data.access_token.token);
      navigate("/user");
    } else {
      console.log(registerRes.meta.message);
      setMessage(registerRes.meta.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container flex flex-col justify-center items-center">
        <div className="text-center">
          <h1>SmallUrl</h1>
          <p>Create an account to get your custom URL</p>
          {message && <div style={{ color: "red" }}>{message}</div>}
        </div>
        <div>
          <form onSubmit={loginHandler}>
            <div className="mb-4">
              <input
                type="text"
                name="email"
                onChange={fieldHandler}
                className="block mb-2 p-2 rounded-md shadow-md w-[400px]"
                placeholder="Email"
              />
              <input
                type="password"
                name="password"
                onChange={fieldHandler}
                className="block mb-2 p-2 rounded-md shadow-md w-[400px]"
                placeholder="Password"
              />
              <input
                type="text"
                name="name"
                onChange={fieldHandler}
                className="block p-2 rounded-md shadow-md w-[400px]"
                placeholder="Name"
              />
            </div>
            <div className="flex flex-row items-center justify-between">
              <Link to="/">Back to Home</Link>
              <button
                type="submit"
                className="bg-sky-500 px-4 py-2 rounded-lg text-white hover:bg-sky-600"
              >
                {loading ? "Loading..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

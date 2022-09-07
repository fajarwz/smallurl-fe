import "../../assets/css/output.css";
import { useReducer } from "react";
import { useNavigate, Link } from "react-router-dom";
import useRedirectIfAuth from "../../hooks/useRedirectIfAuth";
import Notification from "../../components/Notification";
import Input from "../../components/Input";
import InputError from "../../components/InputError";
import SubmitBtn from "../../components/SubmitBtn";
import api from "../../services/api";
import tokenService from "../../services/token.service";
import { registerReducer, INITIAL_STATE } from "../../store/reducers/auth/registerReducer";
import ACTION_TYPES from "../../store/actionTypes";

const Register = () => {
  useRedirectIfAuth();

  const navigate = useNavigate();
  const [state, dispatch] = useReducer(registerReducer, INITIAL_STATE);

  function fieldHandler(e) {
    dispatch({
      type: ACTION_TYPES.CHANGE_INPUT,
      payload: { name: e.target.name, value: e.target.value },
    });
  }

  async function loginHandler(e) {
    e.preventDefault();
    dispatch({ type: ACTION_TYPES.POST_START });
    
    try {
      const registerReq = await api.post("/register", {
          name: state.form.name,
          email: state.form.email,
          password: state.form.password,
          name: state.form.name,
        }
      );

      const registerRes = await registerReq.data;
  
      if (registerRes.meta.code === 200) {
        dispatch({ type: ACTION_TYPES.POST_SUCCESS });

        tokenService.setUser(registerRes.data);
        navigate("/user");
      } else {
        dispatch({
          type: ACTION_TYPES.POST_ERROR,
          payload: registerRes.meta.message,
        });
      }
    } catch (error) {
      console.log(error.response);
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
          {state.error.general.length > 0 && (
            <Notification
              isError={state.error.general.length > 0}
              messages={state.error.general}
            />
          )}
          <form onSubmit={loginHandler}>
            <div className="mb-2">
              <Input
                name="email"
                value={state.form.email}
                placeholder="Email"
                fieldHandler={fieldHandler}
                isError={state.error.email.length > 0}
              />
              <InputError errors={state.error.email} />
            </div>
            <div className="mb-2">
              <Input
                type="password"
                value={state.form.password}
                name="password"
                placeholder="Password"
                fieldHandler={fieldHandler}
                isError={state.error.password.length > 0}
              />
              <InputError errors={state.error.password} />
            </div>
            <div className="mb-4">
              <Input
                value={state.form.name}
                name="name"
                placeholder="Name"
                fieldHandler={fieldHandler}
                isError={state.error.name.length > 0}
              />
              <InputError errors={state.error.name} />
            </div>
            <div className="flex flex-row items-center justify-between">
              <Link to="/">Back to Home</Link>
              <SubmitBtn name={"Register"} loading={state.loading} />
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

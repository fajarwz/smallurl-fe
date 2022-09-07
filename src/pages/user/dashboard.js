import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useReducer, useEffect, useRef, createRef } from "react";
import Input from "../../components/Input";
import InputError from "../../components/InputError";
import CardLink from "../../components/CardLink";
import api from "../../services/api";
import tokenService from "../../services/token.service";
import { dashboardReducer, INITIAL_STATE } from "../../store/reducers/user/dashboard";
import ACTION_TYPES from "../../store/actionTypes";

export default function Dashboard() {
  const { user } = tokenService.getUser();
  const shortenerUrlHost = process.env.REACT_APP_API_HOST;
  const [state, dispatch] = useReducer(dashboardReducer, INITIAL_STATE);
  const navigate = useNavigate();
  
  const urlRefs = useRef([]);
  urlRefs.current = state.urls.map((element, i) => urlRefs.current[i] ?? createRef());
  
  useEffect(() => {
    fetchUrls();
  }, []);

  function fieldHandler(e) {
    dispatch({
      type: ACTION_TYPES.CHANGE_INPUT,
      payload: { name: e.target.name, value: e.target.value },
    });
  }

  async function fetchUrls() {
    const myUrlReq = await api.get("/my-url");

    const myUrlRes = await myUrlReq.data;

    if (myUrlRes.meta.code === 200) {
      dispatch({ type: ACTION_TYPES.FETCH_URLS_SUCCESS, payload: myUrlRes.data });
    } else {
      console.log(myUrlRes.meta.message);
    }
  }

  async function fetchVisits(urlId) {
    const myUrlReq = await api.get(`/visit/${urlId}`);

    const myUrlRes = await myUrlReq.data;

    if (myUrlRes.meta.code === 200) {
      dispatch({ type: ACTION_TYPES.FETCH_VISITS_SUCCESS, payload: myUrlRes.data });
    } else {
      console.log(myUrlRes.meta.message);
    }
  }

  async function shrinkHandler(e) {
    e.preventDefault();
    dispatch({ type: ACTION_TYPES.SHRINK_URL_START });

    try {
      const customUrlReq = await api.post("/custom-url", {
          original_url: state.shrinkUrlForm.originalUrl,
          short_url: state.shrinkUrlForm.shortUrl,
          name: state.shrinkUrlForm.name,
        }
      );
      
      const customUrlRes = await customUrlReq.data;
  
      if (customUrlRes.meta.code === 200) {
        dispatch({ type: ACTION_TYPES.SHRINK_URL_SUCCESS, payload: customUrlRes.data.short_url });

        fetchUrls();
      } else {
        console.log("error post", customUrlRes.meta.message);
        dispatch({ type: ACTION_TYPES.SHRINK_URL_ERROR, payload: customUrlRes.meta.message });
      }
    } catch (error) {
      console.log(error);
    }

  }

  function copyShrinkedUrl() {
    navigator.clipboard.writeText(state.shrinkedUrl);

    alert("URL Copied");
  }

  function logoutHandler() {
    tokenService.removeUser();
    navigate("/login");
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen">
      <div className="mb-4 text-center">
        <h1>Dashboard</h1>
        <div className="flex flex-row items-center">
          <span className="mr-2">Welcome, {user.name} |</span>
          <button
            className="text-blue-500 hover:underline"
            onClick={logoutHandler}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row mb-4">
        <div className="mb-4 md:mb-0 mr-0 md:mr-8">
          <h2>My Links</h2>
          <div className="md:h-[630px] overflow-auto">
            {state.urls.length > 0 ? (
              state.urls.map((url) => {
                return (
                  <a
                    key={url.id}
                    onClick={() => fetchVisits(url.id)}
                    className=" cursor-pointer text-black hover:no-underline"
                  >
                    <CardLink
                      i={url.i}
                      name={url.name}
                      urlRefs={urlRefs}
                      shortUrl={url.short_url}
                      originalUrl={url.original_url}
                    />
                  </a>
                );
              })
            ) : (
              <div>
                <i>Your links will appear here</i>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-4 md:mb-0">
            <h2 className="mb-0">Total Clicks</h2>
            <h3 className="font-normal text-base">
              {state.visits[0]?.name ?? "Click any link to see total clicks"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={state.visits}>
                <Line type="monotone" dataKey="total_visit" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mb-8">
            <h2 className="">Shrink New URL</h2>
            {state.shrinkedUrl && (
              <div>
                <div className="bg-green-500 flex flex-row items-center justify between mb-2 p-2 rounded-md overflow-hidden relative text-center text-white whitespace-nowrap w-[400px]">
                  <span title={state.shrinkedUrl}>{state.shrinkedUrl}</span>
                  <button
                    onClick={copyShrinkedUrl}
                    className="absolute bg-green-500 h-full right-0 px-3 py-2 text-white hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
            <form onSubmit={shrinkHandler} className="flex flex-col">
              <div className="mb-2">
                <Input
                  name="originalUrl"
                  value={state.shrinkUrlForm.originalUrl}
                  placeholder="https://my-very-long-url.com"
                  fieldHandler={fieldHandler}
                  isError={state.error.originalUrl.length > 0}
                />
                <InputError errors={state.error.originalUrl} />
              </div>
              <div className="mb-2">
                <Input
                  name="name"
                  value={state.shrinkUrlForm.name}
                  placeholder="My Awesome URL"
                  fieldHandler={fieldHandler}
                  isError={state.error.name.length > 0}
                />
                <InputError errors={state.error.name} />
              </div>
              <div className="flex flex-col mb-4">
                <div className="flex flex-row items-center">
                  <span>{shortenerUrlHost}</span>
                  <input
                    type="text"
                    name="shortUrl"
                    value={state.shrinkUrlForm.shortUrl}
                    onChange={fieldHandler}
                    className="bg-transparent block border-b-2 border-blue-500 outline-none mr-2 p-2 w-[200px]"
                    placeholder="my-url"
                  />
                </div>
                <div className="">
                  <InputError errors={state.error.shortUrl} />
                </div>
              </div>
              <div className="">
                <button
                  type="submit"
                  className="bg-sky-500 px-4 py-2 rounded-lg text-white hover:bg-sky-600"
                >
                  {state.loading ? "Loading..." : "Shrink"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

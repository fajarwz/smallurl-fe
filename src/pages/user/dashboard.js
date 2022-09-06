import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useState, useEffect, useRef, createRef } from "react";
import Input from "../../components/Input";
import InputError from "../../components/InputError";
import CardLink from "../../components/CardLink";
import api from "../../services/api";
import tokenService from "../../services/token.service";

export default function Dashboard() {
  const { user } = tokenService.getUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    original_url: "",
    short_url: "",
    name: "",
  });
  const [originalUrlError, setOriginalUrlError] = useState([]);
  const [shortUrlError, setShortUrlError] = useState([]);
  const [nameError, setNameError] = useState([]);
  const [shortenedUrl, setShortenedUrl] = useState("");

  const shortenerUrlHost = `${process.env.REACT_APP_REDIRECT_HOST}/`;

  const [visits, setVisits] = useState([]);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    fetchUrls();
  }, []);

  async function fetchUrls() {
    const myUrlReq = await api.get("/my-url");

    const myUrlRes = await myUrlReq.data;

    if (myUrlRes.meta.code === 200) {
      setUrls(myUrlRes.data);
    } else {
      console.log(myUrlRes.meta.message);
    }
  }

  async function fetchVisits(urlId) {
    const myUrlReq = await api.get(
      `${process.env.REACT_APP_API_HOST}/visit/${urlId}`
    );

    const myUrlRes = await myUrlReq.data;

    if (myUrlRes.meta.code === 200) {
      setVisits(myUrlRes.data);
    } else {
      console.log(myUrlRes.meta.message);
    }
  }

  function fieldHandler(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function shrinkHandler(e) {
    e.preventDefault();
    setOriginalUrlError([]);
    setShortUrlError([]);
    setNameError([]);
    setLoading(true);
    setShortenedUrl("");

    const customUrlReq = await api.post(
      `${process.env.REACT_APP_API_HOST}/custom-url`,
      {
        original_url: form.original_url,
        short_url: form.short_url,
        name: form.name,
      }
    );

    setLoading(false);

    const customUrlRes = await customUrlReq.data;
    console.log(customUrlRes);

    if (customUrlRes.meta.code === 200) {
      setShortenedUrl(customUrlRes.data.short_url);
      setForm({
        original_url: "",
        short_url: "",
        name: "",
      });
      fetchUrls();
    } else {
      console.log(customUrlRes.meta.message);
      setOriginalUrlError(customUrlRes.meta.message.original_url ?? []);
      setShortUrlError(customUrlRes.meta.message.short_url ?? []);
      setNameError(customUrlRes.meta.message.name ?? []);
    }
  }

  const urlRefs = useRef([]);
  urlRefs.current = urls.map((element, i) => urlRefs.current[i] ?? createRef());

  function copyshortenedUrl() {
    navigator.clipboard.writeText(shortenedUrl);

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
            {urls.length > 0 ? (
              urls.map((url) => {
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
              {visits[0]?.name ?? "Click any link to see total clicks"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visits}>
                <Line type="monotone" dataKey="total_visit" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mb-8">
            <h2 className="">Shrink New URL</h2>
            {shortenedUrl && (
              <div>
                <div className="bg-green-500 flex flex-row items-center justify between mb-2 p-2 rounded-md overflow-hidden relative text-center text-white whitespace-nowrap w-[400px]">
                  <span title={shortenedUrl}>{shortenedUrl}</span>
                  <button
                    onClick={copyshortenedUrl}
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
                  name="original_url"
                  value={form.original_url}
                  placeholder="https://my-very-long-url.com"
                  fieldHandler={fieldHandler}
                  isError={originalUrlError.length > 0}
                />
                <InputError errors={originalUrlError} />
              </div>
              <div className="mb-2">
                <Input
                  name="name"
                  value={form.name}
                  placeholder="My Awesome URL"
                  fieldHandler={fieldHandler}
                  isError={nameError.length > 0}
                />
                <InputError errors={nameError} />
              </div>
              <div className="flex flex-col mb-4">
                <div className="flex flex-row items-center">
                  <span>{shortenerUrlHost}</span>
                  <input
                    type="text"
                    name="short_url"
                    value={form.short_url}
                    onChange={fieldHandler}
                    className="bg-transparent block border-b-2 border-blue-500 outline-none mr-2 p-2 w-[200px]"
                    placeholder="my-url"
                  />
                </div>
                <div className="">
                  <InputError errors={shortUrlError} />
                </div>
              </div>
              <div className="">
                <button
                  type="submit"
                  className="bg-sky-500 px-4 py-2 rounded-lg text-white hover:bg-sky-600"
                >
                  {loading ? "Loading..." : "Shrink"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

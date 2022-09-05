import useToken from "../../hooks/useToken";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import useAuthGuard from "../../hooks/useAuthGuard";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { useState, useEffect, useRef, createRef } from "react";
import Input from "../../components/Input";
import InputError from "../../components/InputError";
import CardLink from "../../components/CardLink";

export default function Dashboard() {
  useAuthGuard();

  const { token, setToken } = useToken();
  console.log("dashboard prepare fetch", token);
  const { user, setUser } = useUser();
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
    const token2 = await JSON.parse(localStorage.getItem("token"));
    console.log("dashboard fetching", token2);

    const myUrlReq = await fetch(`${process.env.REACT_APP_API_HOST}/my-url`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token2.token}`,
      },
    });

    const myUrlRes = await myUrlReq.json();
    console.log(myUrlRes);

    if (myUrlRes.meta.code === 200) {
      setUrls(myUrlRes.data);
    } else {
      console.log(myUrlRes.meta.message);
    }
  }

  async function fetchVisits(urlId) {
    const myUrlReq = await fetch(
      `${process.env.REACT_APP_API_HOST}/visit/${urlId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      }
    );

    const myUrlRes = await myUrlReq.json();

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

    const customUrlReq = await fetch(
      `${process.env.REACT_APP_API_HOST}/custom-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify({
          original_url: form.original_url,
          short_url: form.short_url,
          name: form.name,
        }),
      }
    );

    setLoading(false);

    const customUrlRes = await customUrlReq.json();
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
    setToken("null");
    setUser("null");
    navigate("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
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
      <div className="flex flex-row mb-4">
        <div className="mr-4">
          <div>
            <h2 className="mb-0">Total Clicks</h2>
            <h3 className="font-normal text-base">
              {visits[0]?.name ?? "Click any link to see total clicks"}
            </h3>
            <LineChart width={600} height={300} data={visits}>
              <Line type="monotone" dataKey="total_visit" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
            </LineChart>
          </div>
          <div className="mb-8">
            <h2 className="">Shrink New URL</h2>
            {shortenedUrl && (
              <>
                <div className="bg-green-500 flex flex-row items-center justify-between mb-2 mx-auto p-2 rounded-md text-center text-white w-[400px]">
                  <span>{shortenedUrl}</span>
                  <button
                    onClick={copyshortenedUrl}
                    className="text-white hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </>
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
        <div>
          <h2>My Links</h2>
          <div className="h-[630px] overflow-auto">
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
      </div>
    </div>
  );
}

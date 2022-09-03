import useToken from "../../hooks/useToken";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import useAuthGuard from "../../hooks/useAuthGuard";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { useState, useEffect, useRef, createRef } from "react";

export default function Dashboard() {
  useAuthGuard();

  const { token, setToken } = useToken();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    original_url: "",
    short_url: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");

  const shortenerUrlHost = `${process.env.REACT_APP_REDIRECT_HOST}/`;

  const [visits, setVisits] = useState([]);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    fetchUrls();
  }, []);

  async function fetchUrls() {
    const myUrlReq = await fetch(`${process.env.REACT_APP_API_HOST}/my-url`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token.token}`,
      },
    });

    const myUrlRes = await myUrlReq.json();
    console.log(myUrlRes);

    if (myUrlRes.meta.code === 200) {
      setUrls(myUrlRes.data);
    } else {
      console.log(myUrlRes.meta.message);
      setError(myUrlRes.meta.message);
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
    console.log(myUrlRes);

    if (myUrlRes.meta.code === 200) {
      setVisits(myUrlRes.data);
    } else {
      console.log(myUrlRes.meta.message);
      setError(myUrlRes.meta.message);
    }
  }

  function fieldHandler(e) {
    const name = e.target.getAttribute("name");

    setForm({
      ...form,
      [name]: e.target.value,
    });
  }

  async function shrinkHandler(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortenedUrl("");

    const data = new FormData(e.currentTarget);
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
          original_url: data.get("original_url"),
          short_url: data.get("short_url"),
          name: data.get("name"),
        }),
      }
    );

    setLoading(false);

    const customUrlRes = await customUrlReq.json();
    console.log(customUrlRes);

    if (customUrlRes.meta.code === 200) {
      setShortenedUrl(customUrlRes.data.short_url);
      fetchUrls();
    } else {
      console.log(customUrlRes.meta.message);
      setError(customUrlRes.meta.message);
    }
  }

  const urlRefs = useRef([]);
  urlRefs.current = urls.map((element, i) => urlRefs.current[i] ?? createRef());

  function copyUrlFromList(ref) {
    const copyText = ref.current;

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyText.value);

    alert("URL Copied");
  }

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
            <h2 className="text-center">Shrink New URL</h2>
            {error.short_url && (
              <>
                <div className="bg-red-500 mb-2 mx-auto p-2 rounded-md text-center text-white w-[500px]">
                  <span>{error.short_url}</span>
                </div>
              </>
            )}
            {shortenedUrl && (
              <>
                <div className="bg-green-500 flex flex-row items-center justify-between mb-2 mx-auto p-2 rounded-md text-center text-white w-[500px]">
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
            <form
              onSubmit={shrinkHandler}
              className="flex flex-col items-center"
            >
              <div className="mb-2">
                <input
                  type="text"
                  name="original_url"
                  onChange={fieldHandler}
                  className="block p-2 rounded-md shadow-md w-[500px]"
                  placeholder="https://my-very-long-url.com"
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  name="name"
                  onChange={fieldHandler}
                  className="block p-2 rounded-md shadow-md w-[500px]"
                  placeholder="My Awesome URL"
                />
              </div>
              <div className="flex flex-row items-center">
                <span>{shortenerUrlHost}</span>
                <input
                  type="text"
                  name="short_url"
                  onChange={fieldHandler}
                  className="bg-transparent block border-b-2 border-blue-500 outline-none mr-2 p-2 w-[210px]"
                  placeholder="my-url"
                />
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
              urls.map((url, i) => {
                return (
                  <a
                    key={url.id}
                    onClick={() => fetchVisits(url.id)}
                    className=" cursor-pointer text-black hover:no-underline"
                  >
                    <div className="bg-white mb-2 p-4 max-w-[500px] rounded-md hover:bg-blue-200">
                      <div className="mb-4">
                        <div>
                          <strong>{url.name}</strong>
                        </div>
                        <div className="flex flex-row">
                          <div className="mr-2 w-full">{url.short_url}</div>
                          <input
                            ref={urlRefs.current[i]}
                            value={url.short_url}
                            className="hidden"
                            readOnly
                          />
                          <button
                            onClick={() => copyUrlFromList(urlRefs.current[i])}
                            className="text-gray-500 hover:underline"
                          >
                            <small>Copy</small>
                          </button>
                        </div>
                      </div>
                      <div>
                        <small className="leading-none">
                          Destination: {url.original_url}
                        </small>
                      </div>
                    </div>
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

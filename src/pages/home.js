import { Link } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    url: "",
  });
  const [shortenedUrl, setShortenedUrl] = useState("");

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

    const data = new FormData(e.currentTarget);
    const loginReq = await fetch(`${process.env.REACT_APP_API_HOST}/short-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        original_url: data.get("url"),
      }),
    });

    setLoading(false);

    const loginRes = await loginReq.json();
    console.log(loginRes);

    if (loginRes.meta.code === 200) {
      setShortenedUrl(loginRes.data.short_url);
    } else {
      console.log(loginRes.meta.message);
      // setMessage(loginRes.meta.message);
    }
  }

  function copyUrl() {
    navigator.clipboard.writeText(shortenedUrl);

    alert("URL Copied");
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen max-w-[575px]">
      <h1>SmallUrl</h1>
      <div className="mb-4">
        <form onSubmit={shrinkHandler}>
          <div className="flex flex-row">
            <input
              type="text"
              name="url"
              onChange={fieldHandler}
              className="block mr-2 p-2 rounded-md shadow-md w-[400px]"
              placeholder="https://my-very-long-url.com"
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
      {shortenedUrl && (
        <>
          <div className="bg-green-500 flex flex-row items-center justify-between mb-8 p-2 rounded-md w-full text-center text-white">
            <span>{shortenedUrl}</span>
            <button onClick={copyUrl} className="text-white hover:underline">
              Copy
            </button>
          </div>
        </>
      )}
      <div>
        <span className=" text-gray-400">Wanna custom URL? </span>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

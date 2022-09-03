import { useState } from "react";
import ShrinkUrl from "../components/ShrinkUrl";
import ShortenedUrlNotification from "../components/ShortenedUrlNotification";
import { Link } from "react-router-dom";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    url: "",
  });
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [error, setError] = useState(null);

  function fieldHandler(e) {
    const name = e.target.getAttribute("name");

    setForm({
      ...form,
      [name]: e.target.value,
    });
  }

  async function shrinkHandler(e) {
    e.preventDefault();
    setShortenedUrl("");
    setError(null);
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const req = await fetch(`${process.env.REACT_APP_API_HOST}/short-url`, {
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

    const res = await req.json();

    if (res.meta.code === 200) {
      setShortenedUrl(res.data.short_url);
    } else {
      setError(res.meta.message);
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
        <ShrinkUrl
          shrinkHandler={shrinkHandler}
          fieldHandler={fieldHandler}
          loading={loading}
          error={error}
        />
      </div>
      <div className="w-full">
        {shortenedUrl && (
          <ShortenedUrlNotification
            shortenedUrl={shortenedUrl}
            copyUrl={copyUrl}
          />
        )}
      </div>
      <div>
        <span className=" text-gray-400">Wanna custom URL? </span>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function LoginForCustomUrl() {
  return (
    <>
      <span className=" text-gray-400">Wanna custom URL? </span>
      <Link to="/login">Login</Link>
    </>
  );
}

import useToken from "../../hooks/useToken";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import useAuthGuard from "../../hooks/useAuthGuard";

export default function Dashboard() {
  const authGuard = useAuthGuard();

  const { token, setToken } = useToken();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  function logoutHandler() {
    setToken("null");
    setUser("null");
    navigate("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}</p>
      <div>
        <button className="text-blue-500 hover:underline" onClick={logoutHandler}>Logout</button>
      </div>
    </div>
  );
}

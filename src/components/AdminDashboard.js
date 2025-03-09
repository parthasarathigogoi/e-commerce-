import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const adminEmail = "admin@gmail.com"; // 🔥 Secret admin email

  if (!user || user.email !== adminEmail) {
    navigate("/login");
    return null;
  }

  return (
    <div>
      <h2>Welcome, Admin</h2>
      <p>You have full access to the system.</p>
      <button onClick={() => auth.signOut()}>Logout</button>
    </div>
  );
};

export default AdminDashboard;

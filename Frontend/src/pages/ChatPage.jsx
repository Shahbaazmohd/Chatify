import { useAuthStore } from "../store/useAuthStore.js";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const ChatPage = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen z-10 text-white w-full max-w-4xl mx-auto p-4">
      <div className="bg-slate-800/80 border border-slate-700 w-full rounded-2xl p-6 shadow-xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">Chat Room</h1>
          <p className="text-sm text-slate-400">Logged in as {authUser?.fullName || "User"}</p>
        </div>
        <button onClick={handleLogout} className="auth-btn w-auto px-6 z-20">Logout</button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 w-full h-[60vh] rounded-2xl p-6 shadow-xl flex flex-col justify-end">
        {/* Placeholder Chat UI */}
        <p className="text-slate-400 text-center mb-6">No messages yet. Send a message to start!</p>
        <div className="flex gap-2">
          <input type="text" placeholder="Type a message..." className="input flex-1" />
          <button className="auth-btn w-auto px-6 z-20">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

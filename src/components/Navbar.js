import { useEffect, useState } from "react";

function Navbar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("username");
    setUsername(user || "Admin");
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="navbar-admin shadow-sm">
      <div className="navbar-left">
        <h4 className="mb-0">📚 Hagios Library Admin</h4>
      </div>

      <div className="navbar-right">
        <span className="user-info">
          👤 {username}
        </span>

        <button
          className="btn btn-danger btn-sm ms-3"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;

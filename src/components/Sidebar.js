import { Link, useLocation } from "react-router-dom";
import logo from "../assets/library-logo.png"; // ⬅️ import logo

function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Books", path: "/books" },
    { name: "Tools", path: "/tools" },
    { name: "Users", path: "/users" },
    { name: "Consumables", path: "/consumables" },
    { name: "Digital Books", path: "/digital-books" },
    { name: "Approvals", path: "/approvals" },
    { name: "Return", path: "/return" },
    { name: "History", path: "/history" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header" style={{ textAlign: "center" }}>
        
        {/* ✅ Logo */}
        <img 
          src={logo} 
          alt="Library Logo" 
          style={{ width: "200px", marginBottom: "10px" }} 
        />

        {/* ✅ Text */}
        <h4>Hagios Library</h4>
      </div>

      <ul className="sidebar-menu">
        {menu.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={
                location.pathname === item.path
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
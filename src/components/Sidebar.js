import { Link, useLocation } from "react-router-dom";
import logo from "../assets/library-logo.png";

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
    { name: "Notifications", path: "/notifications" }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header" style={{ textAlign: "center", padding: "20px 10px" }}>
        
        {/* ✅ Logo diperbesar */}
        <img 
          src={logo} 
          alt="Library Logo" 
          style={{ 
            width: "100px",   // ⬅️ BESARIN (dari 60px → 100px)
            height: "100px",
            objectFit: "contain",
            marginBottom: "10px"
          }} 
        />

        {/* ✅ Text */}
        <h4 style={{ fontSize: "20px", fontWeight: "bold" }}>
          Hagios Library
        </h4>
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
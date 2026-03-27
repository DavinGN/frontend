import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function NotificationPage() {
  const [type, setType] = useState("tool");
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);

  const loadData = async () => {
    try {
      let res;

      if (type === "tool") {
        res = await api.get("/borrow-tools");
        setData(res.data.filter(d => d.status === "dipinjam"));
      } else {
        res = await api.get("/borrow-books");
        setData(res.data.filter(d => d.status === "dipinjam"));
      }
    } catch {
      alert("Failed load data");
    }
  };

  useEffect(() => {
    loadData();
  }, [type]);

  const sendNote = async () => {
    try {
      await api.post("/notifications/borrow-note", {
        borrow_id: selected.id,
        type: type,
        message: message
      });

      alert("Notification sent");
      setMessage("");
      setSelected(null);
    } catch {
      alert("Failed send");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>Notification Management</h2>

        {/* FILTER */}
        <div className="mb-3">
          <button onClick={() => setType("tool")} className="btn btn-primary me-2">
            Tools
          </button>
          <button onClick={() => setType("book")} className="btn btn-secondary">
            Books
          </button>
        </div>

        {/* TABLE */}
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Item</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id}>
                <td>{d.user?.username}</td>
                <td>
                  {type === "tool"
                    ? d.tool?.name
                    : d.book?.title}
                </td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => setSelected(d)}
                  >
                    Send Note
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MODAL SIMPLE */}
        {selected && (
          <div className="card p-3 mt-3">
            <h5>Send Note to {selected.user?.username}</h5>

            <textarea
              className="form-control mb-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button className="btn btn-success" onClick={sendNote}>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
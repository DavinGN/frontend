import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function NotificationPage() {
  const [type, setType] = useState("tool");
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);

  // 🔥 FIX: pakai useCallback biar tidak error di CI
  const loadData = useCallback(async () => {
    try {
      let res;

      if (type === "tool") {
        res = await api.get("/borrow-tools");
        setData(res.data.filter((d) => d.status === "approved"));
      } else {
        res = await api.get("/borrow-books");
        setData(res.data.filter((d) => d.status === "approved"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed load data");
    }
  }, [type]);

  // 🔥 FIX: dependency pakai loadData
  useEffect(() => {
    loadData();
  }, [loadData]);

  // ================= SEND NOTE =================
  const sendNote = async () => {
    if (!message) {
      alert("Message tidak boleh kosong");
      return;
    }

    try {
      await api.post("/notifications/borrow-note", {
        borrow_id: selected.id,
        type: type,
        message: message,
      });

      alert("Notification sent");

      setMessage("");
      setSelected(null);

      // reload data setelah kirim
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed send");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>Notification Management</h2>

        {/* 🔥 FILTER */}
        <div className="mb-3">
          <button
            onClick={() => setType("tool")}
            className={`btn me-2 ${
              type === "tool" ? "btn-primary" : "btn-outline-primary"
            }`}
          >
            Tools
          </button>

          <button
            onClick={() => setType("book")}
            className={`btn ${
              type === "book" ? "btn-primary" : "btn-outline-primary"
            }`}
          >
            Books
          </button>
        </div>

        {/* 📊 TABLE */}
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Item</th>
              <th width="150">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((d) => (
                <tr key={d.id}>
                  <td>{d.user?.username}</td>

                  <td>
                    {type === "tool"
                      ? d.tool?.name
                      : d.book?.title}
                  </td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => setSelected(d)}
                    >
                      Send Note
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ✉️ FORM KIRIM NOTE */}
        {selected && (
          <div className="card p-3 mt-3">
            <h5>
              Send Note to <b>{selected.user?.username}</b>
            </h5>

            <textarea
              className="form-control mb-2"
              rows="3"
              placeholder="Input pesan..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={sendNote}>
                Send
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setSelected(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
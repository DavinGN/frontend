import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Approvals() {
  const [bookRequests, setBookRequests] = useState([]);
  const [toolRequests, setToolRequests] = useState([]);
  const [consumableRequests, setConsumableRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const books = await api.get("/borrow-books");
      const tools = await api.get("/borrow-tools");
      const consumables = await api.get("/consumable-requests");

      setBookRequests(books.data);
      setToolRequests(tools.data);
      setConsumableRequests(consumables.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed load approval data");
    } finally {
      setLoading(false);
    }
  };

  // ================= BOOK =================
  const approveBook = async (id) => {
    await api.post(`/borrow-books/${id}/approve`);
    fetchAll();
  };

  const rejectBook = async (id) => {
    await api.post(`/borrow-books/${id}/reject`);
    fetchAll();
  };

  const returnBook = async (id) => {
    await api.post(`/borrow-books/${id}/return`);
    fetchAll();
  };

  // ================= TOOL =================
  const approveTool = async (id) => {
    await api.post(`/borrow-tools/${id}/approve`);
    fetchAll();
  };

  const rejectTool = async (id) => {
    await api.post(`/borrow-tools/${id}/reject`);
    fetchAll();
  };

  const returnTool = async (id) => {
    await api.post(`/borrow-tools/${id}/return`);
    fetchAll();
  };

  // ================= CONSUMABLE =================
  const approveConsumable = async (id) => {
    await api.post(`/consumable-requests/${id}/approve`);
    fetchAll();
  };

  const rejectConsumable = async (id) => {
    await api.post(`/consumable-requests/${id}/reject`);
    fetchAll();
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
      case "dipinjam":
        return "success";
      case "rejected":
        return "danger";
      case "returned":
        return "primary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <div className="container-fluid mt-3">
          <h2 className="fw-bold mb-4">📋 Approvals</h2>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              {/* ================= BOOKS ================= */}
              <h4 className="mb-3">📚 Book Borrow Requests</h4>
              <BookToolTable
                data={bookRequests}
                type="book"
                approve={approveBook}
                reject={rejectBook}
                returnItem={returnBook}
                statusColor={statusColor}
              />

              {/* ================= TOOLS ================= */}
              <h4 className="mt-5 mb-3">🔧 Tool Borrow Requests</h4>
              <BookToolTable
                data={toolRequests}
                type="tool"
                approve={approveTool}
                reject={rejectTool}
                returnItem={returnTool}
                statusColor={statusColor}
              />

              {/* ================= CONSUMABLE ================= */}
              <h4 className="mt-5 mb-3">🧪 Consumable Requests</h4>
              <ConsumableTable
                data={consumableRequests}
                approve={approveConsumable}
                reject={rejectConsumable}
                statusColor={statusColor}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function BookToolTable({
  data,
  type,
  approve,
  reject,
  returnItem,
  statusColor,
}) {
  return (
    <div className="table-responsive mb-4">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Item</th>
            <th>User</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th width="220">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td>
                {type === "book" && r.book?.title}
                {type === "tool" && r.tool?.name}
              </td>
              <td>{r.user?.username}</td>
              <td>{r.borrow_date || "-"}</td>
              <td>{r.return_date || "-"}</td>
              <td>
                <span className={`badge bg-${statusColor(r.status)}`}>
                  {r.status}
                </span>
              </td>
              <td>
                {r.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => approve(r.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => reject(r.id)}
                    >
                      Reject
                    </button>
                  </>
                )}

                {(r.status === "approved" ||
                  r.status === "dipinjam") &&
                  returnItem && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => returnItem(r.id)}
                    >
                      Mark Returned
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center mt-3">
          No requests found
        </div>
      )}
    </div>
  );
}

function ConsumableTable({ data, approve, reject, statusColor }) {
  return (
    <div className="table-responsive mb-4">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Item</th>
            <th>User</th>
            <th>Jumlah</th>
            <th>Status</th>
            <th width="200">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td>{r.consumable?.name}</td>
              <td>{r.user?.username}</td>
              <td>{r.quantity}</td>
              <td>
                <span className={`badge bg-${statusColor(r.status)}`}>
                  {r.status}
                </span>
              </td>
              <td>
                {r.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => approve(r.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => reject(r.id)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center mt-3">
          No requests found
        </div>
      )}
    </div>
  );
}

export default Approvals;
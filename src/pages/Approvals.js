import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function ApprovalsPage() {
  const [books, setBooks] = useState([]);
  const [tools, setTools] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const b = await api.get("/borrow-books");
    const t = await api.get("/borrow-tools");
    const c = await api.get("/consumable-requests");

    setBooks(b.data.filter(e => e.status === "pending"));
    setTools(t.data.filter(e => e.status === "pending"));
    setConsumables(c.data.filter(e => e.status === "pending"));
    setLoading(false);
  };

  const approve = (url) => api.post(url).then(load);
  const reject = (url) => api.post(url).then(load);

  const statusColor = (status) => ({
    pending: "warning",
    approved: "success",
    dipinjam: "success",
    rejected: "danger",
    returned: "primary",
  }[status] || "secondary");

  return (
    <Layout title="Approvals" loading={loading}>
      <h4>📚 Books</h4>
      <BookToolTable
        data={books}
        type="book"
        approve={(id)=>approve(`/borrow-books/${id}/approve`)}
        reject={(id)=>reject(`/borrow-books/${id}/reject`)}
        statusColor={statusColor}
      />

      <h4 className="mt-4">🔧 Tools</h4>
      <BookToolTable
        data={tools}
        type="tool"
        approve={(id)=>approve(`/borrow-tools/${id}/approve`)}
        reject={(id)=>reject(`/borrow-tools/${id}/reject`)}
        statusColor={statusColor}
      />

      <h4 className="mt-4">🧪 Consumables</h4>
      <ConsumableTable
        data={consumables}
        approve={(id)=>approve(`/consumable-requests/${id}/approve`)}
        reject={(id)=>reject(`/consumable-requests/${id}/reject`)}
        statusColor={statusColor}
      />
    </Layout>
  );
}

function Layout({ title, loading, children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <div className="container-fluid mt-3">
          <h2 className="fw-bold mb-4">{title}</h2>

          {loading
            ? <div className="text-center">Loading...</div>
            : children}
        </div>
      </div>
    </div>
  );
}

function BookToolTable({ data, type, approve, reject, returnItem, statusColor }) {
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
                {type === "book" ? r.book?.title : r.tool?.name}
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
                {approve && r.status === "pending" && (
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

                {returnItem &&
                  (r.status === "approved" || r.status === "dipinjam") && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => returnItem(r.id)}
                    >
                      Return
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center mt-3">No data</div>
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
                {approve && r.status === "pending" && (
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
        <div className="text-center mt-3">No data</div>
      )}
    </div>
  );
}

export default ApprovalsPage;
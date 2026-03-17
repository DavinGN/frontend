import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    pending: 0,
  });

  const [topBooks, setTopBooks] = useState([]);
  const [topTools, setTopTools] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const statsRes = await api.get("/stats");
      const booksRes = await api.get("/dashboard/top-books");
      const toolsRes = await api.get("/dashboard/top-tools");
      const usersRes = await api.get("/dashboard/top-users");

      setStats(statsRes.data);
      setTopBooks(booksRes.data);
      setTopTools(toolsRes.data);
      setTopUsers(usersRes.data);

    } catch (err) {
      console.error("DASHBOARD ERROR:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      } else if (err.response?.status === 403) {
        alert("Access denied. Admin only.");
      } else {
        alert("Failed load dashboard data");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="container-fluid mt-3">
          <h2 className="mb-4 fw-bold">📊 Dashboard</h2>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              {/* ==== STATS ==== */}
              <div className="row g-4 mb-4">
                <div className="col-md-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <h6 className="text-muted">Total Books</h6>
                      <h2 className="fw-bold">{stats.books}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <h6 className="text-muted">Total Users</h6>
                      <h2 className="fw-bold">{stats.users}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <h6 className="text-muted">Pending Borrow</h6>
                      <h2 className="fw-bold text-warning">
                        {stats.pending}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==== TOP BOOKS ==== */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    📚 Top 5 Books
                  </h5>

                  {topBooks.length === 0 ? (
                    <p>No data</p>
                  ) : (
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>No</th>
                          <th>Title</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topBooks.slice(0, 5).map((b, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{b.title}</td>
                            <td>{b.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* ==== TOP TOOLS ==== */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    🔧 Top 5 Tools
                  </h5>

                  {topTools.length === 0 ? (
                    <p>No data</p>
                  ) : (
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topTools.slice(0, 5).map((t, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{t.name}</td>
                            <td>{t.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* ==== TOP USERS ==== */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    👤 Top 5 Users
                  </h5>

                  {topUsers.length === 0 ? (
                    <p>No data</p>
                  ) : (
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>No</th>
                          <th>Username</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topUsers.slice(0, 5).map((u, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{u.username}</td>
                            <td>{u.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
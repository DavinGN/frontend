import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function HistoryPage() {
  const [books, setBooks] = useState([]);
  const [tools, setTools] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("book");

  // 🔥 SEARCH
  const [search, setSearch] = useState("");

  // 🔥 PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔥 SORT
  const [sortBy, setSortBy] = useState("borrow_date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const b = await api.get("/borrow-books");
      const t = await api.get("/borrow-tools");
      const c = await api.get("/consumable-requests");

      setBooks(
        b.data.filter(e =>
          e.status === "rejected" || e.status === "returned"
        )
      );

      setTools(
        t.data.filter(e =>
          e.status === "rejected" || e.status === "returned"
        )
      );

      setConsumables(
        c.data.filter(e =>
          e.status === "approved" || e.status === "rejected"
        )
      );

    } catch (err) {
      console.error(err);
      alert("Failed load history");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "-";
    return date.split("T")[0];
  };

  // 🔥 SORT FUNCTION
  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a[sortBy] || 0);
      const dateB = new Date(b[sortBy] || 0);

      return sortOrder === "desc"
        ? dateB - dateA
        : dateA - dateB;
    });
  };

  // 🔥 PAGINATION
  const paginate = (data) => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const statusColor = (status) => ({
    rejected: "danger",
    returned: "primary",
    approved: "success",
  }[status] || "secondary");

  // 🔥 ACTIVE DATA
  let activeData =
    filter === "book" ? books :
    filter === "tool" ? tools :
    consumables;

  // 🔥 SEARCH FILTER
  const filteredData = activeData.filter((item) => {
    const keyword = search.toLowerCase();

    if (filter === "book") {
      return item.book?.title?.toLowerCase().includes(keyword);
    }

    if (filter === "tool") {
      return item.tool?.name?.toLowerCase().includes(keyword);
    }

    if (filter === "consumable") {
      return item.consumable?.name?.toLowerCase().includes(keyword);
    }

    return true;
  });

  const sortedData = sortData(filteredData);
  const paginatedData = paginate(sortedData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Layout title="📜 History" loading={loading}>

      {/* FILTER */}
      <div className="mb-3">
        <button
          className={`btn me-2 ${filter==="book"?"btn-primary":"btn-outline-primary"}`}
          onClick={() => { setFilter("book"); setCurrentPage(1); }}
        >
          📚 Books
        </button>

        <button
          className={`btn me-2 ${filter==="tool"?"btn-primary":"btn-outline-primary"}`}
          onClick={() => { setFilter("tool"); setCurrentPage(1); }}
        >
          🔧 Tools
        </button>

        <button
          className={`btn ${filter==="consumable"?"btn-primary":"btn-outline-primary"}`}
          onClick={() => { setFilter("consumable"); setCurrentPage(1); }}
        >
          🧪 Consumables
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* SORT */}
      <div className="mb-3 d-flex gap-2">
        <select
          className="form-select w-auto"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="borrow_date">Borrow Date</option>
          <option value="return_date">Return Date</option>
          <option value="created_at">Request Date</option>
        </select>

        <select
          className="form-select w-auto"
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Terbaru</option>
          <option value="asc">Terlama</option>
        </select>
      </div>

      {/* TABLE */}
      {filter !== "consumable" ? (
        <BookToolTable
          data={paginatedData}
          type={filter}
          statusColor={statusColor}
          formatDate={formatDate}
        />
      ) : (
        <ConsumableTable
          data={paginatedData}
          statusColor={statusColor}
          formatDate={formatDate}
        />
      )}

      {/* PAGINATION */}
      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-secondary me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Prev
        </button>

        <span className="align-self-center">
          Page {currentPage} / {totalPages || 1}
        </span>

        <button
          className="btn btn-secondary ms-2"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>

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

function BookToolTable({ data, type, statusColor, formatDate }) {
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
          </tr>
        </thead>

        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td>
                {type === "book" ? r.book?.title : r.tool?.name}
              </td>

              <td>{r.user?.username}</td>
              <td>{formatDate(r.borrow_date)}</td>
              <td>{formatDate(r.return_date)}</td>

              <td>
                <span className={`badge bg-${statusColor(r.status)}`}>
                  {r.status}
                </span>
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

function ConsumableTable({ data, statusColor, formatDate }) {
  return (
    <div className="table-responsive mb-4">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Item</th>
            <th>User</th>
            <th>Jumlah</th>
            <th>Request Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td>{r.consumable?.name}</td>
              <td>{r.user?.username}</td>
              <td>{r.quantity}</td>
              <td>{formatDate(r.created_at)}</td>

              <td>
                <span className={`badge bg-${statusColor(r.status)}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center">No data</div>
      )}
    </div>
  );
}

export default HistoryPage;
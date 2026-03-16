import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Consumables() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id: null,
    name: "",
    stock: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  // ================= FETCH =================
  const fetchConsumables = useCallback(async (p = 1) => {
    try {
      const res = await api.get(`/consumables?page=${p}&search=${search}`);

      setItems(res.data.data);
      setLastPage(res.data.last_page);
      setPage(res.data.current_page);
    } catch (err) {
      alert("Failed load consumables");
      console.error(err);
    }
  }, [search]);

  useEffect(() => {
    fetchConsumables(1);
  }, [fetchConsumables]);

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      stock: "",
    });
    setIsEdit(false);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await api.put(`/consumables/${form.id}`, form);
        alert("Consumable updated");
      } else {
        await api.post("/consumables", form);
        alert("Consumable created");
      }

      resetForm();
      fetchConsumables(page);
    } catch (err) {
      alert("Save failed");
      console.error(err.response?.data);
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name || "",
      stock: item.stock || "",
    });
    setIsEdit(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this consumable?")) return;

    try {
      await api.delete(`/consumables/${id}`);
      fetchConsumables(page);
    } catch {
      alert("Delete failed");
    }
  };

  // ================= UI =================
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <h2>Consumables Management</h2>

        {/* 🔍 SEARCH */}
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Search consumable..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 📝 FORM */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-2">
            <div className="col">
              <input
                className="form-control"
                name="name"
                placeholder="Consumable Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col">
              <input
                type="number"
                className="form-control"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
              />
            </div>

            <div className="col-auto">
              <button className="btn btn-primary">
                {isEdit ? "Update" : "Add"}
              </button>
            </div>

            {isEdit && (
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>

        {/* 📊 TABLE */}
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Stock</th>
              <th width="150">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.stock}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔢 PAGINATION */}
        <div style={{ marginTop: 20 }}>
          <button
            disabled={page === 1}
            onClick={() => fetchConsumables(page - 1)}
            className="btn btn-secondary btn-sm me-2"
          >
            Prev
          </button>

          <span>
            Page {page} / {lastPage}
          </span>

          <button
            disabled={page === lastPage}
            onClick={() => fetchConsumables(page + 1)}
            className="btn btn-secondary btn-sm ms-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Consumables;

import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id: null,
    username: "",
    password: "",
    role_id: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  // ================= FETCH USERS =================
  const fetchUsers = useCallback(async (p = 1) => {
    try {
      const res = await api.get(`/users?page=${p}&search=${search}`);

      setUsers(res.data.data);
      setLastPage(res.data.last_page);
      setPage(res.data.current_page);
    } catch (err) {
      alert("Failed load users");
      console.error(err);
    }
  }, [search]);

  // ================= FETCH ROLES =================
  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch {
      console.log("Failed load roles");
    }
  };

  useEffect(() => {
    fetchUsers(1);
    fetchRoles();
  }, [fetchUsers]);

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      id: null,
      username: "",
      password: "",
      role_id: "",
    });
    setIsEdit(false);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await api.put(`/users/${form.id}`, form);
        alert("User updated");
      } else {
        await api.post("/users", form);
        alert("User created");
      }

      resetForm();
      fetchUsers(page);
    } catch (err) {
      alert("Save failed");
      console.error(err.response?.data);
    }
  };

  // ================= EDIT =================
  const handleEdit = (user) => {
    setForm({
      id: user.id,
      username: user.username || "",
      password: "",
      role_id: user.role_id || "",
    });
    setIsEdit(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers(page);
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
        <h2>Users Management</h2>

        {/* 🔍 SEARCH */}
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Search username..."
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
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder={isEdit ? "Password (optional)" : "Password"}
                value={form.password}
                onChange={handleChange}
                required={!isEdit}
              />
            </div>

            <div className="col">
              <select
                className="form-control"
                name="role_id"
                value={form.role_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Role --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
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
              <th>Username</th>
              <th>Role</th>
              <th width="150">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.role?.name}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(u)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(u.id)}
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
            onClick={() => fetchUsers(page - 1)}
            className="btn btn-secondary btn-sm me-2"
          >
            Prev
          </button>

          <span>
            Page {page} / {lastPage}
          </span>

          <button
            disabled={page === lastPage}
            onClick={() => fetchUsers(page + 1)}
            className="btn btn-secondary btn-sm ms-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Users;

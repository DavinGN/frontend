import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Tools() {

  const [tools, setTools] = useState([]);
  const [kondisis, setKondisis] = useState([]);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id: null,
    name: "",
    location: "",
    kondisi_id: ""
  });

  const [isEdit, setIsEdit] = useState(false);


  // ================= FETCH TOOLS =================
  const fetchTools = useCallback(async (p = 1) => {

    try {

      const res = await api.get(`/tools?page=${p}&search=${search}`);

      setTools(res.data.data);
      setLastPage(res.data.last_page);
      setPage(res.data.current_page);

    } catch {

      alert("Failed load tools");

    }

  }, [search]);


  // ================= FETCH KONDISI =================
  const fetchKondisi = async () => {

    try {

      const res = await api.get("/kondisis");
      setKondisis(res.data);

    } catch {

      alert("Failed load kondisi");

    }

  };


  useEffect(() => {

    fetchTools(1);
    fetchKondisi();

  }, [fetchTools]);


  // ================= FORM =================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  const resetForm = () => {

    setForm({
      id: null,
      name: "",
      location: "",
      kondisi_id: ""
    });

    setIsEdit(false);

  };


  // ================= SUBMIT =================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (isEdit) {

        await api.put(`/tools/${form.id}`, form);
        alert("Tool updated");

      } else {

        await api.post("/tools", form);
        alert("Tool created");

      }

      resetForm();
      fetchTools(page);

    } catch (err) {

      alert("Save failed");
      console.error(err.response?.data);

    }

  };


  // ================= EDIT =================
  const handleEdit = (tool) => {

    setForm({
      id: tool.id,
      name: tool.name || "",
      location: tool.location || "",
      kondisi_id: tool.kondisi_id || ""
    });

    setIsEdit(true);

  };


  // ================= DELETE =================
  const handleDelete = async (id) => {

    if (!window.confirm("Delete this tool?")) return;

    try {

      await api.delete(`/tools/${id}`);
      fetchTools(page);

    } catch {

      alert("Delete failed");

    }

  };

  // ================= EXPORT EXCEL =================
  const exportToExcel = async () => {
    try {
      const res = await api.get("/tools?all=true");

      const data = res.data.data.map((t) => ({
        Name: t.name,
        Location: t.location,
        Condition: t.kondisi?.name,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Tools");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const file = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(file, "Tools.xlsx");
    } catch (err) {
      alert("Export failed");
    }
  };

  // ================= UI =================
  return (

    <div className="layout">

      <Sidebar/>

      <div className="main">

        <Navbar/>

        <h2>Tools Management</h2>

        {/* 📥 EXPORT EXCEL */}
        <button className="btn btn-success mb-3" onClick={exportToExcel}>
          Export Excel
        </button>

        {/* 🔍 SEARCH */}
        <div className="mb-3">

          <input
            className="form-control"
            placeholder="Search tool name or location..."
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
                placeholder="Tool Name"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>


            <div className="col">

              <input
                className="form-control"
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
              />

            </div>


            {/* KONDISI */}
            <div className="col">

              <select
                className="form-control"
                name="kondisi_id"
                value={form.kondisi_id}
                onChange={handleChange}
              >

                <option value="">Select Condition</option>

                {kondisis.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name}
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
              <th>Name</th>
              <th>Location</th>
              <th>Condition</th>
              <th width="150">Action</th>
            </tr>

          </thead>

          <tbody>

            {tools.map((t) => (

              <tr key={t.id}>

                <td>{t.name}</td>
                <td>{t.location}</td>
                <td>{t.kondisi?.name}</td>

                <td>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(t)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(t.id)}
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
            onClick={() => fetchTools(page - 1)}
            className="btn btn-secondary btn-sm me-2"
          >
            Prev
          </button>

          <span>
            Page {page} / {lastPage}
          </span>

          <button
            disabled={page === lastPage}
            onClick={() => fetchTools(page + 1)}
            className="btn btn-secondary btn-sm ms-2"
          >
            Next
          </button>

        </div>

      </div>

    </div>

  );

}

export default Tools;
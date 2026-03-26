import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import * as xlsx from "xlsx";
import { saveAs } from "file-saver";

function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  // form state
  const [form, setForm] = useState({
    id: null,
    title: "",
    author: "",
    publisher: "",
    pages: "",
    category_id: "",
    location: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  // ================= FETCH BOOKS =================
  const fetchBooks = useCallback(
    async (p = 1) => {
      try {
        const res = await api.get(`/books?page=${p}&search=${search}`);

        setBooks(res.data.data);
        setLastPage(res.data.last_page);
        setPage(res.data.current_page);
      } catch (err) {
        alert("Failed load books");
        console.error(err);
      }
    },
    [search]
  );

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories"); // ⚠️ pastikan route ada
      setCategories(res.data);
    } catch (err) {
      console.error("Failed load categories");
    }
  };

  useEffect(() => {
    fetchBooks(1);
    fetchCategories();
  }, [fetchBooks]);

  // ================= HANDLE FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      author: "",
      publisher: "",
      pages: "",
      category_id: "",
      location: "",
    });
    setIsEdit(false);
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await api.put(`/books/${form.id}`, form);
        alert("Book updated");
      } else {
        await api.post("/books", form);
        alert("Book created");
      }

      resetForm();
      fetchBooks(page);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Save failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (book) => {
    setForm({
      id: book.id,
      title: book.title || "",
      author: book.author || "",
      publisher: book.publisher || "",
      pages: book.pages || "",
      category_id: book.category_id || "",
      location: book.location || "",
    });
    setIsEdit(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await api.delete(`/books/${id}`);
      fetchBooks(page);
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ================= EXPORT EXCEL =================
  const exportToExcel = () => {
    const data = books.map((b) => ({
      Title: b.title,
      Author: b.author,
      Publisher: b.publisher,
      Pages: b.pages,
      Category: b.category?.name,
      Location: b.location,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Books");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "Books.xlsx");
  };

  // ================= UI =================
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <h2 className="mb-3">Books Management</h2>

        {/* 🔍 SEARCH */}
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Search title, author, publisher, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 📝 FORM */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-2">
            <div className="col-md-2">
              <input
                className="form-control"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                name="author"
                placeholder="Author"
                value={form.author}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                name="publisher"
                placeholder="Publisher"
                value={form.publisher}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-1">
              <input
                className="form-control"
                name="pages"
                placeholder="Pages"
                value={form.pages}
                onChange={handleChange}
              />
            </div>

            {/* ✅ CATEGORY DROPDOWN */}
            <div className="col-md-2">
              <select
                className="form-select"
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ LOCATION */}
            <div className="col-md-2">
              <input
                className="form-control"
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-1 d-grid">
              <button className="btn btn-primary">
                {isEdit ? "Update" : "Add"}
              </button>
            </div>

            {isEdit && (
              <div className="col-md-1 d-grid">
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

        {/* 📥 EXPORT EXCEL */}
        <button className="btn btn-success mb-3" onClick={exportToExcel}>
          Export Excel
        </button>

        {/* 📊 TABLE */}
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>Pages</th>
              <th>Category</th>
              <th>Location</th>
              <th width="150">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.publisher}</td>
                <td>{b.pages}</td>
                <td>{b.category?.name}</td>
                <td>{b.location}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(b)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(b.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔢 PAGINATION */}
        <div className="mt-3">
          <button
            disabled={page === 1}
            onClick={() => fetchBooks(page - 1)}
            className="btn btn-secondary btn-sm me-2"
          >
            Prev
          </button>

          <span>
            Page {page} / {lastPage}
          </span>

          <button
            disabled={page === lastPage}
            onClick={() => fetchBooks(page + 1)}
            className="btn btn-secondary btn-sm ms-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Books;

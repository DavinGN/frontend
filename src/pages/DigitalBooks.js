import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DigitalBooks() {

  const [books,setBooks] = useState([]);
  const [categories,setCategories] = useState([]);

  const [page,setPage] = useState(1);
  const [lastPage,setLastPage] = useState(1);

  const [search,setSearch] = useState("");

  const [file,setFile] = useState(null);

  const [form,setForm] = useState({
    id:null,
    title:"",
    author:"",
    category_id:"",
    description:""
  });

  const [isEdit,setIsEdit] = useState(false);


  const fetchBooks = useCallback(async(p=1)=>{

    const res = await api.get(`/digital-books?page=${p}&search=${search}`);

    setBooks(res.data.data);
    setPage(res.data.current_page);
    setLastPage(res.data.last_page);

  },[search]);


  const fetchCategories = async()=>{
    const res = await api.get("/categories");
    setCategories(res.data);
  };


  useEffect(()=>{

    const delay = setTimeout(()=>{
      fetchBooks(1);
    },400);

    fetchCategories();

    return ()=>clearTimeout(delay);

  },[fetchBooks]);


  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };


  const resetForm = ()=>{
    setForm({
      id:null,
      title:"",
      author:"",
      category_id:"",
      description:""
    });

    setFile(null);
    setIsEdit(false);
  };


  const handleSubmit = async(e)=>{

    e.preventDefault();

    const formData = new FormData();

    formData.append("title",form.title);
    formData.append("author",form.author);
    formData.append("category_id",form.category_id);
    formData.append("description",form.description);

    if(file){
      formData.append("file",file);
    }

    try{

      if(isEdit){

        await api.post(`/digital-books/${form.id}?_method=PUT`,formData);

      }else{

        await api.post("/digital-books",formData);

      }

      alert("Saved");

      resetForm();
      fetchBooks(page);

    }catch(err){

      alert("Upload failed");

    }

  };


  const handleEdit = (book)=>{

    setForm({
      id:book.id,
      title:book.title || "",
      author:book.author || "",
      category_id:book.category_id || "",
      description:book.description || ""
    });

    setIsEdit(true);

  };


  const handleDelete = async(id)=>{

    if(!window.confirm("Delete this digital book?")) return;

    await api.delete(`/digital-books/${id}`);

    fetchBooks(page);

  };


  return (

    <div className="layout">

      <Sidebar/>

      <div className="main">

        <Navbar/>

        <h2>Digital Books Management</h2>

        <input
          className="form-control mb-3"
          placeholder="Search digital books..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />


        <form onSubmit={handleSubmit} className="mb-4">

          <div className="row g-2">

            <div className="col">
              <input
                className="form-control"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col">
              <input
                className="form-control"
                name="author"
                placeholder="Author"
                value={form.author}
                onChange={handleChange}
              />
            </div>

            <div className="col">
              <select
                className="form-control"
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Category</option>

                {categories.map(c=>(
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}

              </select>
            </div>

            <div className="col">
              <input
                type="file"
                accept=".pdf,.epub"
                className="form-control"
                onChange={(e)=>setFile(e.target.files[0])}
              />
            </div>

            <div className="col-auto">
              <button className="btn btn-primary">
                {isEdit ? "Update":"Add"}
              </button>
            </div>

          </div>

        </form>


        <table className="table table-bordered">

          <thead className="table-dark">

            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>File</th>
              <th width="150">Action</th>
            </tr>

          </thead>

          <tbody>

            {books.map(b=>(
              <tr key={b.id}>

                <td>{b.title}</td>

                <td>{b.author}</td>

                <td>{b.category?.name || "-"}</td>

                <td>
                  <a
                    href={`https://backend-3-production-7c6c.up.railway.app/storage/${b.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-info btn-sm"
                  >
                    View
                  </a>
                </td>

                <td>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={()=>handleEdit(b)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={()=>handleDelete(b.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>


        <div style={{marginTop:20}}>

          <button
            disabled={page===1}
            onClick={()=>fetchBooks(page-1)}
            className="btn btn-secondary btn-sm me-2"
          >
            Prev
          </button>

          <span>
            Page {page} / {lastPage}
          </span>

          <button
            disabled={page===lastPage}
            onClick={()=>fetchBooks(page+1)}
            className="btn btn-secondary btn-sm ms-2"
          >
            Next
          </button>

        </div>

      </div>

    </div>

  );

}

export default DigitalBooks;
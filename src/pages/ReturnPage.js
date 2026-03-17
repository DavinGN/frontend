import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function ReturnPage() {
  const [books, setBooks] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const b = await api.get("/borrow-books");
      const t = await api.get("/borrow-tools");

      setBooks(
        b.data.filter(e =>
          e.status === "approved" || e.status === "dipinjam"
        )
      );

      setTools(
        t.data.filter(e =>
          e.status === "approved" || e.status === "dipinjam"
        )
      );

    } catch (err) {
      console.error(err);
      alert("Failed load return data");
    } finally {
      setLoading(false);
    }
  };

  const returnItem = (url) => api.post(url).then(load);

  const statusColor = (status) => ({
    approved: "success",
    dipinjam: "success",
    returned: "primary",
  }[status] || "secondary");

  return (
    <Layout title="🔄 Return" loading={loading}>

      <h4>📚 Books</h4>
      <BookToolTable
        data={books}
        type="book"
        returnItem={(id)=>returnItem(`/borrow-books/${id}/return`)}
        statusColor={statusColor}
      />

      <h4 className="mt-4">🔧 Tools</h4>
      <BookToolTable
        data={tools}
        type="tool"
        returnItem={(id)=>returnItem(`/borrow-tools/${id}/return`)}
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

// function ConsumableTable({ data, approve, reject, statusColor }) {
//   return (
//     <div className="table-responsive mb-4">
//       <table className="table table-bordered table-hover">
//         <thead className="table-dark">
//           <tr>
//             <th>Item</th>
//             <th>User</th>
//             <th>Jumlah</th>
//             <th>Status</th>
//             <th width="200">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((r) => (
//             <tr key={r.id}>
//               <td>{r.consumable?.name}</td>
//               <td>{r.user?.username}</td>
//               <td>{r.quantity}</td>

//               <td>
//                 <span className={`badge bg-${statusColor(r.status)}`}>
//                   {r.status}
//                 </span>
//               </td>

//               <td>
//                 {approve && r.status === "pending" && (
//                   <>
//                     <button
//                       className="btn btn-success btn-sm me-2"
//                       onClick={() => approve(r.id)}
//                     >
//                       Approve
//                     </button>

//                     <button
//                       className="btn btn-danger btn-sm"
//                       onClick={() => reject(r.id)}
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {data.length === 0 && (
//         <div className="text-center mt-3">No data</div>
//       )}
//     </div>
//   );
// }

export default ReturnPage;
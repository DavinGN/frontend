import React from "react";

export function BookToolTable({
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
                    <button className="btn btn-success btn-sm me-2" onClick={() => approve(r.id)}>
                      Approve
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => reject(r.id)}>
                      Reject
                    </button>
                  </>
                )}

                {(r.status === "approved" || r.status === "dipinjam") &&
                  returnItem && (
                    <button className="btn btn-primary btn-sm" onClick={() => returnItem(r.id)}>
                      Mark Returned
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && <div className="text-center mt-3">No data</div>}
    </div>
  );
}

export function ConsumableTable({ data, approve, reject, statusColor }) {
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
                    <button className="btn btn-success btn-sm me-2" onClick={() => approve(r.id)}>
                      Approve
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => reject(r.id)}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && <div className="text-center mt-3">No data</div>}
    </div>
  );
}
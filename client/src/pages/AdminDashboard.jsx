import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '../services/ContextProvider';

const STATUSES = ["New", "Contacted", "Site Visit Scheduled", "Closed", "Lost"];
const UNIT_TYPES = ["2 BHK", "3 BHK", "Villa"];
const SOURCES = ["Website", "Facebook", "Referral", "Walk-in"];

function Field({ formik, name, label, type = "text", as, children }) {
  return (
    <div className="mb-2">
      <label className="form-label fw-semibold">{label}</label>
      {as === "select" ? (
        <select
          name={name}
          className={`form-select ${formik.touched[name] && formik.errors[name] ? "is-invalid" : ""}`}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select</option>
          {children}
        </select>
      ) : as === "textarea" ? (
        <textarea
          name={name}
          className="form-control"
          rows={2}
          value={formik.values[name]}
          onChange={formik.handleChange}
        />
      ) : (
        <input
          type={type}
          name={name}
          className={`form-control ${formik.touched[name] && formik.errors[name] ? "is-invalid" : ""}`}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      )}
      {formik.touched[name] && formik.errors[name] && (
        <div className="invalid-feedback">{formik.errors[name]}</div>
      )}
    </div>
  );
}

const leadSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  interestedProperty: Yup.string(),
  unitType: Yup.string().required("Unit type is required"),
  budget: Yup.string().required("Budget is required"),
  source: Yup.string(),
  status: Yup.string().required("Status is required"),
  notes: Yup.string(),
});

const emptyLead = {
  name: "", email: "", phone: "", interestedProperty: "",
  unitType: "", budget: "", source: "", status: "", notes: "",
};

function AdminDashboard() {
  const navigate = useNavigate();
  const { leads, fetchLeads, createLead, updateLead, deleteLead } = useAppContext();

  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const formik = useFormik({
    initialValues: emptyLead,
    validationSchema: leadSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingLead) {
          await updateLead(editingLead._id, values);
          toast.success("Lead updated");
        } else {
          await createLead(values);
          toast.success("Lead added");
        }
        await fetchLeads();
        resetForm();
        setShowModal(false);
        setEditingLead(null);
      } catch {
        toast.error("Something went wrong");
      }
    },
  });

  const openAdd = () => {
    setEditingLead(null);
    formik.resetForm({ values: emptyLead });
    setShowModal(true);
  };

  const openEdit = (lead) => {
    setEditingLead(lead);
    formik.resetForm({ values: { ...emptyLead, ...lead } });
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await deleteLead(deleteTarget._id);
    toast.success("Lead deleted");
    await fetchLeads();
    setDeleteTarget(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginInfo");
    navigate("/");
  };

  const filtered = leads
    .filter(l =>
      (!search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search)) &&
      (!filterStatus || l.status === filterStatus) &&
      (!filterUnit || l.unitType === filterUnit)
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  const count = (status) => leads.filter(l => l.status === status).length;

  return (
    <div className="container-fluid p-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Fute Services — Lead Dashboard</h4>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Leads", value: leads.length, color: "primary" },
          { label: "New", value: count("New"), color: "info" },
          { label: "Contacted", value: count("Contacted"), color: "warning" },
          { label: "Site Visit Scheduled", value: count("Site Visit Scheduled"), color: "secondary" },
          { label: "Closed", value: count("Closed"), color: "success" },
          { label: "Lost", value: count("Lost"), color: "danger" },
        ].map(c => (
          <div className="col-6 col-md-2" key={c.label}>
            <div className={`card text-white bg-${c.color} text-center p-3`}>
              <div className="fs-2 fw-bold">{c.value}</div>
              <div className="small">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <input
          className="form-control"
          style={{ maxWidth: 220 }}
          placeholder="Search name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="form-select" style={{ maxWidth: 180 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="form-select" style={{ maxWidth: 160 }} value={filterUnit} onChange={e => setFilterUnit(e.target.value)}>
          <option value="">All Unit Types</option>
          {UNIT_TYPES.map(u => <option key={u}>{u}</option>)}
        </select>
        <select className="form-select" style={{ maxWidth: 180 }} value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        <button className="btn btn-success ms-auto" onClick={openAdd}>+ Add Lead</button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Property</th>
              <th>Unit Type</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} className="text-center text-muted">No leads found</td></tr>
            ) : (
              filtered.map((lead, i) => (
                <tr key={lead._id}>
                  <td>{i + 1}</td>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.email}</td>
                  <td>{lead.interestedProperty || "—"}</td>
                  <td>{lead.unitType}</td>
                  <td>{lead.budget}</td>
                  <td>
                    <span className={`badge bg-${statusColor(lead.status)}`}>{lead.status}</span>
                  </td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-info me-1" onClick={() => navigate(`/lead/${lead._id}`)}>View</button>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(lead)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(lead)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingLead ? "Edit Lead" : "Add New Lead"}</h5>
                <button className="btn-close" onClick={() => { setShowModal(false); setEditingLead(null); }} />
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6"><Field formik={formik} name="name" label="Full Name *" /></div>
                    <div className="col-md-6"><Field formik={formik} name="email" label="Email *" type="email" /></div>
                    <div className="col-md-6"><Field formik={formik} name="phone" label="Phone Number *" /></div>
                    <div className="col-md-6"><Field formik={formik} name="interestedProperty" label="Interested Property" /></div>
                    <div className="col-md-6">
                      <Field formik={formik} name="unitType" label="Unit Type *" as="select">
                        {UNIT_TYPES.map(u => <option key={u}>{u}</option>)}
                      </Field>
                    </div>
                    <div className="col-md-6"><Field formik={formik} name="budget" label="Budget *" /></div>
                    <div className="col-md-6">
                      <Field formik={formik} name="source" label="Lead Source" as="select">
                        {SOURCES.map(s => <option key={s}>{s}</option>)}
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field formik={formik} name="status" label="Status *" as="select">
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </Field>
                    </div>
                    <div className="col-12"><Field formik={formik} name="notes" label="Notes" as="textarea" /></div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingLead(null); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingLead ? "Update" : "Add Lead"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this lead? <strong>{deleteTarget.name}</strong>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function statusColor(status) {
  return { New: "info", Contacted: "warning", "Site Visit Scheduled": "secondary", Closed: "success", Lost: "danger" }[status] || "dark";
}

export default AdminDashboard;

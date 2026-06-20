import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function statusColor(status) {
  return { New: "info", Contacted: "warning", "Site Visit Scheduled": "secondary", Closed: "success", Lost: "danger" }[status] || "dark";
}

function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`https://lead-dashboard-nn92.onrender.com/api/leads/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.lead) setLead(data.lead);
        else setError("Lead not found");
      })
      .catch(() => setError("Failed to fetch lead"));
  }, [id]);

  if (error) return (
    <div className="container mt-5 text-center">
      <p className="text-danger">{error}</p>
      <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );

  if (!lead) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" />
    </div>
  );

  return (
    <div className="container py-5" style={{ maxWidth: 700 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Lead Details</h4>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-5">{lead.name}</span>
          <span className={`badge bg-${statusColor(lead.status)}`}>{lead.status}</span>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="text-muted small">Email</label>
              <p className="fw-semibold mb-0">{lead.email}</p>
            </div>
            <div className="col-md-6">
              <label className="text-muted small">Phone</label>
              <p className="fw-semibold mb-0">{lead.phone}</p>
            </div>
            <div className="col-md-6">
              <label className="text-muted small">Interested Property</label>
              <p className="fw-semibold mb-0">{lead.interestedProperty || "—"}</p>
            </div>
            <div className="col-md-6">
              <label className="text-muted small">Unit Type</label>
              <p className="fw-semibold mb-0">{lead.unitType}</p>
            </div>
            <div className="col-md-6">
              <label className="text-muted small">Budget</label>
              <p className="fw-semibold mb-0">{lead.budget}</p>
            </div>
            <div className="col-md-6">
              <label className="text-muted small">Lead Source</label>
              <p className="fw-semibold mb-0">{lead.source || "—"}</p>
            </div>
            <div className="col-md-6">
              <label className="text-muted small">Created Date</label>
              <p className="fw-semibold mb-0">{new Date(lead.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="col-md-6">
              <label className="text-muted small">Last Updated</label>
              <p className="fw-semibold mb-0">{new Date(lead.updatedAt).toLocaleDateString()}</p>
            </div>
            {lead.notes && (
              <div className="col-12">
                <label className="text-muted small">Notes</label>
                <p className="fw-semibold mb-0">{lead.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetail;

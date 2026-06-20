import React, { createContext, useContext, useState, useCallback } from 'react';

const myContext = createContext();

const API = "http://localhost:8000/api/leads";

const ContextProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const createLead = async (lead) => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    return res.json();
  };

  const updateLead = async (id, lead) => {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    return res.json();
  };

  const deleteLead = async (id) => {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    return res.json();
  };

  return (
    <myContext.Provider value={{ leads, fetchLeads, createLead, updateLead, deleteLead }}>
      {children}
    </myContext.Provider>
  );
};

const useAppContext = () => useContext(myContext);

export { ContextProvider, myContext, useAppContext };


import Api from "./api";
import { HandleErr } from "../compenet/HAndleErr";

export const GetAllClients = async (setErr) => {
  try {
    const res = await Api.get("/clients");
    return res.data.clients;
  } catch (err) {
    HandleErr(err, setErr);
  }
};

export const AddClient = async (client, setErr, navigate) => {
  try {
    const res = await Api.post("/clients", client);
    navigate(res.data.redirect_to);
  } catch (err) {
    HandleErr(err, setErr);
  }
};

export const DeleteClient = async (ClientID, setErr) => {
  try {
    await Api.delete(`/clients/${ClientID}`);
  } catch (err) {
    HandleErr(err, setErr);
  }
};

export const UpdateClientByID = async (client, setErr, navigate) => {
  try {
    const res = await Api.put(`/clients/${client.id}`, client);
    navigate(res.data.redirect_to);
  } catch (err) {
    HandleErr(err, setErr);
  }
};

export const SearchClient = async (query, setErr) => {
  try {
    const res = await Api.get(`/clients/search?q=${query}`);
    return res.data.clients;
  } catch (err) {
    HandleErr(err, setErr);
  }
};

export const GetClientById = async (id, setErr) => {
  try {
    const res = await Api.get(`/clients/${id}`);
    return res.data.client;
  } catch (err) {
    HandleErr(err, setErr);
  }
};


export const getTopClientsByPaidInvoices = async (setErr) => {
  try {
    const res = await Api.get("/clients-top-paid");
    return res.data.clients;
  } catch (err) {
    HandleErr(err, setErr);
  }
};

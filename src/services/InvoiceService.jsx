import Api from "./api";
import { HandleErr } from "../compenet/HAndleErr";

export const GetAllInvoices = async (setErr) => {
  try {
    const res = await Api.get("/invoices");
    return res.data.invoices;
  } catch (err) {
    HandleErr(err, setErr);
  }
};

export const AddInvoices = async (deleveryId, setErr, navigate) => {
  try {
    await Api.post(`/invoice-from-bl/${deleveryId}`);
    navigate(-1);
  } catch (err) {
    HandleErr(err, setErr);
  }
};

export const updateStatusInvoices = async (invoiceID, newStatus, setErr) => {
  try {
    const res = await Api.patch(`/invoicesStatus/${invoiceID}`, {
      status: newStatus,
    },);
    return res.data.invoices;
  } catch (err) {
    HandleErr(err, setErr);
  }
};


export const SearchInvoice = async(query,setErr)=>{
  try{
    const res = await Api.get(`/invoices/search?q=${query}`);
    return res.data.invoices
    }catch(err){
      HandleErr(err,setErr)
    }
}


export const GetInvoiceById = async (id, setErr) => {
  try {
    const res = await Api.get(`/invoices/${id}`);
    return res.data.invoice;
  } catch (err) {
    HandleErr(err, setErr);
  }
};

export const GetSumInvoice = async (setErr) => {
  try {
    const res = await Api.get(`/invoices-total-paid`);
    return res.data.total_paid_invoices;
  } catch (err) {
    HandleErr(err, setErr);
  }
};

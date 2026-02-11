import { toast } from "react-toastify";
import Api from "./api";
import { HandleErr } from "../compenet/HAndleErr";

export const GetAllQuotes = async (setErr) => {
  try {
    const res = await Api.get("/quotes");
    return res.data.quotes;
  } catch (err) {
    HandleErr(err, setErr);
  }
};


export const GetValideQuotes = async (setErr) => {
  try {
    const res = await Api.get("/quotes-valider");
    return res.data.quotes;
  } catch (err) {
    HandleErr(err, setErr);
  }
};

export const AddQuotes = async (quote, setErr,navigate) => {
  try {
    const res = await Api.post("/quotes", quote);
    toast.success(res.data.message || "Registration successful!", {
      style: {
        width: "400px",
        height: "100px",
        fontSize: "16px",
      },
    });
    navigate(res.data.redirect_to)

  } catch (err) {
    HandleErr(err, setErr);
  }
};


export const UpdateQuoteByID = async (quoteID, quoteData, setErr, navigate) => {
  try {
    const res = await Api.put(`/quotes/${quoteID}`, quoteData);
    navigate(res.data.redirect_to);
    toast.success(res.data.message || "Updating successful!", {
      style: { width: "400px", height: "100px", fontSize: "16px" },
    });
  } catch (err) {
    HandleErr(err, setErr);
  }
};


export const updateStatusQuotes = async (quoteID, newStatus, setErr) => {
  try {
    const res = await Api.patch(`/quotesStatus/${quoteID}`, {
      status: newStatus,
    });
    return res.data.quotes;
  } catch (err) {
    HandleErr(err, setErr);
  }
};


export const SearchQuote = async(query,setErr)=>{
  try{
    const res = await Api.get(`/quotes/search?q=${query}`);
    return res.data.quotes
    }catch(err){
      HandleErr(err,setErr)
    }
}

export const SearchValideQuote = async(query,setErr)=>{
  try{
    const res = await Api.get(`/quotes-valider/search?q=${query}`);
    return res.data.quotes
    }catch(err){
      HandleErr(err,setErr)
    }
}


export const GetquoteById = async (id, setErr) => {
  try {
    const res = await Api.get(`/quotes/${id}`);
    return res.data.quote;
  } catch (err) {
    HandleErr(err, setErr);
  }
};

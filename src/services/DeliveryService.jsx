import { toast } from "react-toastify";
import Api from "./api";
import { HandleErr } from "../compenet/HAndleErr";

export const GetAllDeliveries = async (setErr) => {
  try {
    const res = await Api.get("/deliveries");
    return res.data.deliveries;
  } catch (err) {
    HandleErr(err, setErr);
  }
};


export const GetValideDeliveries = async (setErr) => {
  try {
    const res = await Api.get("/deliveries-livré");
    return res.data.deliveries;
  } catch (err) {
    HandleErr(err, setErr);
  }
};

export const AddDeliveries = async (QuoteID,delivery, setErr,navigate) => {
  try {
    const res = await Api.post(`/deliveries/${QuoteID}`, delivery);
    toast.success(res.data.message || "Registration successful!", {
      style: {
        width: "400px",
        height: "100px",
        fontSize: "16px",
      },
    });
    navigate(-1);

  } catch (err) {
    HandleErr(err, setErr);
  }
};



export const updateStatusDeliveries = async (deliveryID, newStatus, setErr) => {
  try {
    const res = await Api.patch(`/deliveriesStatus/${deliveryID}`, {
      status: newStatus,
    });
    return res.data.deliveries;
  } catch (err) {
    HandleErr(err, setErr);
  }
};


export const SearchDelivery = async(query,setErr)=>{
  try{
    const res = await Api.get(`/deliveries/search?q=${query}`);
    return res.data.deliveries
    }catch(err){
      HandleErr(err,setErr)
    }
}

export const SearchValideDelivery = async(query,setErr)=>{
  try{
    const res = await Api.get(`/deliveries-livré/search?q=${query}`);
    return res.data.deliveries
    }catch(err){
      HandleErr(err,setErr)
    }
}


export const GetDeliveryById = async (id, setErr) => {
  try {
    const res = await Api.get(`/deliveries/${id}`);
    return res.data.delivery;
  } catch (err) {
    HandleErr(err, setErr);
  }
};

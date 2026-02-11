import { toast } from "react-toastify";
import Api from "./api";
import { HandleErr } from "../compenet/HAndleErr";

export const GetAllProduits = async (setErrMsg) => {
  try {
    const res = await Api.get("/produits");
    return res.data.produits;
  } catch (err) {
    HandleErr(err, setErrMsg);
  }
};

export const AddProduit = async (produit, setErrMsg,navigate) => {
  try {
    const res = await Api.post("/produits", produit);
    toast.success(res.data.message || "Registration successful!", {
      style: {
        width: "400px",
        height: "100px",
        fontSize: "16px",
      },
    });
    navigate("/admin/produits");

  } catch (err) {
    HandleErr(err, setErrMsg);
  }
};



export const DeleteProduit = async (ProduitID,setErrMsg)=>{
  try{
    const res = await Api.delete(`/produits/${ProduitID}`) 
    toast.success(res.data.message, {
      style: {
        width: "400px",
        height: "100px",
        fontSize: "16px",
      },
    });
  }catch(err){
    HandleErr(err,setErrMsg)
  }
}


export const UpdateProduitByID = async (produit, setErrMsg,navigate) => {
  try {
    const res = await Api.put(`/produits/${produit.id}`, produit);
    navigate("/admin/produits")
    toast.success(res.data.message || "Updating successful!", {
      style: {
        width: "400px",
        height: "100px",
        fontSize: "16px",
      },
    });
  } catch (err) {
    HandleErr(err, setErrMsg);
  }
};


export const SearchProduit= async(query,setErrMsg)=>{
  try{
    const res = await Api.get(`/produits/search?q=${query}`);
    return res.data.produits
    }catch(err){
      HandleErr(err,setErrMsg)
    }
}


export const GetProduitById = async (id, setErrMsg) => {
  try {
    const res = await Api.get(`/produits/${id}`);
    return res.data.produit;
  } catch (err) {
    HandleErr(err, setErrMsg);
  }
};

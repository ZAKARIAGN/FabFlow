import { HandleErr } from "../compenet/HAndleErr";
import Api from "./api";

export const GetAllDoucuments = async (setErr) => {
  try {
    const res = await Api.get("/documents");
    return res.data.documents;
  } catch (err) {
    HandleErr(err, setErr);
  }
};


export const SearchDocuments = async(query,setErr)=>{
  try{
    const res = await Api.get(`/documents/search?q=${query}`);
    return res.data.documents
    }catch(err){
      HandleErr(err,setErr)
    }
}

export const GetDocumentById = async (id, setErrMsg) => {
  try {
    const res = await Api.get(`/documents/${id}`);
    return res.data.document;
  } catch (err) {
    HandleErr(err, setErrMsg);
  }
};
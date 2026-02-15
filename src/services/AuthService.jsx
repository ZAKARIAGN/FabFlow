import Api from "./api";
import Cookies from "js-cookie";
import { HandleErr } from "../compenet/HAndleErr";

export const RegisterService = async (user, setErr,navigate) => {
  try {
    await Api.post("/register", user);
    


    navigate(-1)

  } catch (err) {
    HandleErr(err,setErr)
  }
};






export const LoginService = async (user, setErrMsg, navigate) => {
  try {
    const res =await Api.post("/login", user);


    Cookies.set("token", res.data.user.token, { expires: 7, path: "/" });
    setTimeout(() => {
      navigate(res.data.redirect_to);
    }, 1000);
  } catch (err) {
    HandleErr(err, setErrMsg);
  }
};

export const GetAllUsers = async (setErr) => {
  try {
    const res = await Api.get("/users");
    return res.data.users;
  } catch (err) {
    HandleErr(err, setErr);
  }
};


export const DeleteUser = async (userID,setErr)=>{
  try{
  await Api.delete(`/users/${userID}`) 

  }catch(err){
    HandleErr(err,setErr)
  }
}

export const GetUserByID = async (id, setErr) => {
  try {
    const res = await Api.get(`/users/${id}`);
    return res.data.user;
  } catch (err) {
    if (setErr) {
      setErr(err.response?.data || { message: "Erreur serveur" });
    }
  }
};



export const UpdateUserByID = async (id, data, setErr, navigate) => {
  try {
    await Api.put(`/users/${id}`, data);
    navigate(-1);
  } catch (err) {
    HandleErr(err, setErr);
  }
};


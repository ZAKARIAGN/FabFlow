import Api from "./api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { HandleErr } from "../compenet/HAndleErr";

export const RegisterService = async (user, setErr) => {
  try {
    const res = await Api.post("/register", user);
    

    toast.success(res.data.message || "Registration successful!", {
      style: {
        width: "400px",
        height: "100px",
        fontSize: "16px",
      },
    });

  } catch (err) {
    HandleErr(err,setErr)
  }
};






export const LoginService = async (user, setErrMsg, navigate) => {
  try {
    const res = await Api.post("/login", user);


    Cookies.set("token", res.data.user.token, { expires: 7, path: "/" });
    toast.success(res.data.message || "Login successful!", {
      style: {
        width: "500px",
        height: "100px",
        fontSize: "16px",
      },
    });
    setTimeout(() => {
      navigate(res.data.redirect_to);
    }, 1000);
  } catch (err) {
    HandleErr(err, setErrMsg);
  }
};

import Api from "./api";
import Cookies from "js-cookie";
import { HandleErr } from "../compenet/HAndleErr";

export const RegisterService = async (user, setErr, navigate) => {
  try {
    await Api.post("/register", user);
    navigate(-1);
  } catch (err) {
    HandleErr(err, setErr);
  }
};

export const LoginService = async (user, setErrMsg, navigate) => {
  try {
    console.log("🔵 Tentative de connexion...", user);

    const res = await Api.post("/login", user);

    const { token, role } = res.data.user;
    const redirectTo = res.data.redirect_to;

    console.log("🔀 Redirection vers:", redirectTo);

    Cookies.set("token", token, { expires: 7, path: "/" });
    Cookies.set("role", role, { expires: 7, path: "/" });

    navigate(redirectTo);
  } catch (err) {
    HandleErr(err, setErrMsg);
  }
};

export const LogoutService = async (navigate) => {
  try {
    await Api.post("/logout");
  } catch (err) {
    console.error("Logout error", err);
  } finally {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("role", { path: "/" });
    navigate("/login");
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
export const DeleteUser = async (userID, setErr) => {
  try {
    await Api.delete(`/users/${userID}`);
  } catch (err) {
    HandleErr(err, setErr);
  }
};

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

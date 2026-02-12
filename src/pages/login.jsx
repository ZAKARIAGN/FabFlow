import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { LoginService } from "../services/AuthService";
import ErrMsg from "../compenet/ErrMsg";

const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errMsg, setErrMsg] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg({});

    try {
      await LoginService(userData, setErrMsg, navigate);
    } catch (error) {
      console.error("Erreur de connexion", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#90b4ce]/10 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#90b4ce]/20 overflow-hidden">
        <div className="bg-[#094067] p-8 text-center">
          <h1 className="text-3xl font-black text-white">
            FAB<span className="text-[#3da9fc]">FLOW</span>
          </h1>
          <p className="text-[#90b4ce] text-xs mt-2 uppercase tracking-widest">
            Gestion Industrielle B2B
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-[#094067] mb-6 text-center">
            Ravi de vous revoir !
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5f6c7b] uppercase ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-[#90b4ce]" size={18} />
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="admin@fabflow.ma"
                  className="w-full pl-10 pr-4 py-3 border rounded-xl border-[#90b4ce]/30 focus:border-[#3da9fc] outline-none text-sm"
                  disabled={loading}
                  required
                />
                <ErrMsg msg={errMsg.errors?.email?.[0]} />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5f6c7b] uppercase ml-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[#90b4ce]" size={18} />
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border rounded-xl border-[#90b4ce]/30 focus:border-[#3da9fc] outline-none text-sm"
                  disabled={loading}
                  required
                />
                <ErrMsg msg={errMsg.errors?.password?.[0]} />
              </div>
            </div>

            {/* Global error */}
            {errMsg.errors?.incorrect && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                {errMsg.errors.incorrect[0]}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#3da9fc] text-white font-bold py-3 rounded-xl shadow-lg transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#094067]"
              }`}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-8 text-center text-[#90b4ce] text-[10px] font-medium uppercase tracking-wider">
            Propulsé par FabFlow Engineering v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
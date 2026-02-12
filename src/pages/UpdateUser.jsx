import { useState, useEffect } from "react";
import { UserPlus, Users, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GetUserByID, UpdateUserByID } from "../services/AuthService";

const UpdateUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errMsg, setErrMsg] = useState({});
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: "", label: "Sélectionner le rôle" },
    { value: "comptable", label: "Comptable" },
    { value: "commercial", label: "Commercial" },
    { value: "atelier", label: "Atelier" },
    { value: "admin", label: "Administrateur" },
  ];

  /* ================= FETCH USER DATA ================= */
  useEffect(() => {
    const fetchUser = async () => {
      const user = await GetUserByID(id, setErrMsg);
      if (user) {
        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          password: "",
          password_confirmation: "",
          role: user.role?.roleName || "",
        });
      }
    };
    fetchUser();
  }, [id]);

  /* ================= HANDLE INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrMsg((prev) => ({ ...prev, [name]: "" }));
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await UpdateUserByID(id, formData, setErrMsg, navigate);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET FORM ================= */
  const handleReset = async () => {
    setErrMsg({});
    const user = await GetUserByID(id, setErrMsg);
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
        role: user.role?.roleName || "",
      });
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="text-[#094067]" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-[#094067]">
                Modifier le Compte Utilisateur
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Modifiez les informations de l'utilisateur
              </p>
            </div>
          </div>
          <button
            onClick={()=>navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:shadow-md transition-all"
          >
            <ArrowLeft size={18} />
            <span>Retour</span>
          </button>
        </div>

        {/* Update User Form */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full border ${
                    errMsg.first_name ? "border-red-500" : "border-gray-300"
                  } rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#094067] focus:border-transparent`}
                />
                {errMsg.first_name?.[0] && (
                  <p className="text-red-500 text-xs mt-1">{errMsg.first_name[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full border ${
                    errMsg.last_name ? "border-red-500" : "border-gray-300"
                  } rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#094067] focus:border-transparent`}
                />
                {errMsg.last_name?.[0] && (
                  <p className="text-red-500 text-xs mt-1">{errMsg.last_name[0]}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border ${
                  errMsg.email ? "border-red-500" : "border-gray-300"
                } rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#094067] focus:border-transparent`}
              />
              {errMsg.email?.[0] && (
                <p className="text-red-500 text-xs mt-1">{errMsg.email[0]}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rôle <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full border ${
                  errMsg.role ? "border-red-500" : "border-gray-300"
                } rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#094067] focus:border-transparent bg-white`}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errMsg.role?.[0] && (
                <p className="text-red-500 text-xs mt-1">{errMsg.role[0]}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full border ${
                    errMsg.password ? "border-red-500" : "border-gray-300"
                  } rounded-xl px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#094067] focus:border-transparent`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errMsg.password?.[0] && (
                <p className="text-red-500 text-xs mt-1">{errMsg.password[0]}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Laisser vide si vous ne voulez pas changer le mot de passe
              </p>
            </div>

            {/* Password Confirmation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full border ${
                    errMsg.password_confirmation
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-xl px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#094067] focus:border-transparent`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errMsg.password_confirmation?.[0] && (
                <p className="text-red-500 text-xs mt-1">{errMsg.password_confirmation[0]}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#094067] text-white rounded-xl font-bold hover:bg-[#0a5085] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Mise à jour en cours...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Mettre à jour le Compte
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Réinitialiser
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserForm;

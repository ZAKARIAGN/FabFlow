import { useState } from "react";
import { UserPlus, Users, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterService } from "../services/AuthService";

const FormUsers = () => {

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
  const navigate = useNavigate();
  const roleOptions = [
    {value:"",label:"Sélectionner le role"},
    { value: "comptable", label: "Comptable" },
    { value: "commercial", label: "Commercial" },
    { value: "atelier", label: "Atelier" }, 
  ];

  /* ================= HANDLE INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    setErrMsg((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* ================= VALIDATE FORM ================= */
  const validateForm = () => {
    const errors = {};

    if (!formData.first_name.trim()) {
      errors.first_name = "Le prénom est requis";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email invalide";
    }

    if (!formData.password) {
      errors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      errors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (!formData.password_confirmation) {
      errors.password_confirmation = "La confirmation est requise";
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = "Les mots de passe ne correspondent pas";
    }

    if (!formData.role) {
      errors.role = "Le rôle est requis";
    }

    setErrMsg(errors);
    return Object.keys(errors).length === 0;
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await RegisterService(formData, setErrMsg,navigate);
      // Reset form after successful registration
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET FORM ================= */
  const handleReset = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "comptable",
    });
    setErrMsg({});
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
                Gestion des Comptes Utilisateurs
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Créer et gérer les comptes des utilisateurs
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

        {/* Create User Form */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="mb-6">
            <h2 className="font-bold text-gray-800 text-xl flex items-center gap-2">
              <UserPlus size={24} />
              Créer un Nouveau Compte
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Remplissez les informations pour créer un compte utilisateur
            </p>
          </div>

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
                  placeholder="Ex: Mohamed"
                  className={`w-full border ${
                    errMsg.first_name ? "border-red-500" : "border-gray-300"
                  } rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#094067] focus:border-transparent`}
                />
                {errMsg.first_name && (
                  <p className="text-red-500 text-xs mt-1">{errMsg.first_name}</p>
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
                  placeholder="Ex: Alaoui"
                  className={`w-full border ${
                    errMsg.last_name ? "border-red-500" : "border-gray-300"
                  } rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#094067] focus:border-transparent`}
                />
                {errMsg.last_name && (
                  <p className="text-red-500 text-xs mt-1">{errMsg.last_name}</p>
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
                placeholder="exemple@email.com"
                className={`w-full border ${
                  errMsg.email ? "border-red-500" : "border-gray-300"
                } rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#094067] focus:border-transparent`}
              />
              {errMsg.email && (
                <p className="text-red-500 text-xs mt-1">{errMsg.email}</p>
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
              {errMsg.role && (
                <p className="text-red-500 text-xs mt-1">{errMsg.role}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe <span className="text-red-500">*</span>
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
              {errMsg.password && (
                <p className="text-red-500 text-xs mt-1">{errMsg.password}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Minimum 8 caractères
              </p>
            </div>

            {/* Password Confirmation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmer le mot de passe <span className="text-red-500">*</span>
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
              {errMsg.password_confirmation && (
                <p className="text-red-500 text-xs mt-1">
                  {errMsg.password_confirmation}
                </p>
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
                    Création en cours...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Créer le Compte
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

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Users size={20} />
            Informations sur les Rôles
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex gap-2">
              <span className="font-semibold min-w-32">Comptable:</span>
              <span>Gestion des factures, paiements et documents comptables</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-32">Commercial:</span>
              <span>Gestion des devis, clients et opportunités commerciales</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-32">Magasinier:</span>
              <span>Gestion des stocks, bons de livraison et inventaire</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-32">Administrateur:</span>
              <span>Accès complet à toutes les fonctionnalités du système</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormUsers;
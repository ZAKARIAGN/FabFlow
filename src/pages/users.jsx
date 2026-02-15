import { useEffect, useState } from "react";
import { GetAllUsers, DeleteUser } from "../services/AuthService";
import { FaPlus } from "react-icons/fa";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UsersList = ({ isDark }) => {
  const [users, setUsers] = useState([]);
  const [errMsg, setErrMsg] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await GetAllUsers(setErrMsg);
        setUsers(data || []);
      } catch {
        setErrMsg({ message: "Erreur lors du chargement des utilisateurs" });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?"))
      return;
    await DeleteUser(id, setErrMsg);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${isDark ? "bg-[#0f172a]" : ""}`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? "border-[#5b9bd5]" : "border-blue-600"}`}
        ></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-[#0f172a]" : ""}`}>
      <div className="max-w-6xl mx-auto rounded-lg p-6">
        <div className="flex flex-col lg:flex-row md:flex-row gap-5 lg:gap-0 md:gap-0 sm:gap-2 justify-between items-center mb-8">
          <h1
            className={`text-[20px] lg:text-2xl font-black tracking-tighter uppercase ${isDark ? "text-[#5b9bd5]" : "text-[#094067]"}`}
          >
            Liste des utilisateurs
          </h1>
          <button
            onClick={() => navigate("/admin/ajouter-utilisateur")}
            className="text-center w-[150px] lg:w-[200px] md:w-[150px] text-[16px] lg:text-sm md:text-sm sm:text-sm bg-[#094067] hover:bg-[#3da9fc] text-white lg:px-6 px-2 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            <FaPlus size={14} />
            Ajouter User
          </button>
        </div>

        {errMsg?.message && (
          <div
            className={`mb-4 p-3 rounded ${isDark ? "bg-red-900/30 text-red-400 border border-red-800" : "bg-red-100 text-red-700"}`}
          >
            {errMsg.message}
          </div>
        )}

        <div
          className={`w-full overflow-x-auto rounded-2xl border shadow-sm ${isDark ? "border-[#334155] bg-[#1e293b]" : "border-[#90b4ce]/10 bg-white"}`}
        >
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead
              className={`border-b ${isDark ? "bg-[#0f172a] border-[#334155]" : "bg-[#f8fafc] border-[#90b4ce]/10"}`}
            >
              <tr
                className={`font-black text-[10px] uppercase tracking-widest ${isDark ? "text-[#5b9bd5]" : "text-[#90b4ce]"}`}
              >
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Prénom</th>
                <th className="p-4 text-left">Nom</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody
              className={`divide-y ${isDark ? "divide-[#334155]" : "divide-[#90b4ce]/5"}`}
            >
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className={`group transition-colors ${isDark ? "hover:bg-[#263449]" : "hover:bg-[#90b4ce]/5"}`}
                  >
                    <td
                      className={`p-4 font-bold text-xs ${isDark ? "text-gray-500" : "text-[#5f6c7b]"}`}
                    >
                      {user.id}
                    </td>
                    <td
                      className={`p-4 font-bold ${isDark ? "text-gray-200" : "text-[#094067]"}`}
                    >
                      {user.first_name}
                    </td>
                    <td
                      className={`p-4 font-bold ${isDark ? "text-gray-200" : "text-[#094067]"}`}
                    >
                      {user.last_name}
                    </td>
                    <td
                      className={`p-4 font-bold ${isDark ? "text-gray-200" : "text-[#094067]"}`}
                    >
                      {user.email}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            navigate(`/admin/update-user/${user.id}`)
                          }
                          className={`p-1.5 ${isDark ? "text-[#3da9fc] lg:text-gray-500 lg:hover:text-[#3da9fc]" : "text-[#3da9fc] lg:text-[#5f6c7b] lg:hover:text-[#3da9fc]"}`}
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(user.id)}
                          className={`p-1.5 ${isDark ? "text-[#ef4565] lg:text-gray-500 lg:hover:text-[#ef4565]" : "text-[#ef4565] lg:text-[#5f6c7b] lg:hover:text-[#ef4565]"}`}
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className={`p-6 text-center ${isDark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
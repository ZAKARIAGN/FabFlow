// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./compenet/ProtectedRoute";

// Pages
import Login from "./pages/login";
import Dashboard from "./pages/dashbord";
import Produits from "./pages/Produits";
import AllDocuments from "./pages/AllDocument";
import PagePicking from "./pages/PagePicking";
import AdminLayout from "./Layout/AdminLayout";
import Clients from "./pages/Clients";
import ClientForm from "./pages/ClientForm";
import UpdateClient from "./pages/updateClient";
import ProduitForm from "./pages/ProduitForm";
import UpdateProduit from "./pages/updateProduit";
import DevisForm from "./pages/Devis";
import DocumentView from "./pages/documentDetail";
import PageUpdateDevis from "./pages/devisUpdate";
import PagePickingInvoice from "./pages/PageFactures";
import CommercialLayout from "./Layout/CommercialLayout";
import AllDevis from "./pages/AllDevis";
import AllDeliveries from "./pages/AllBL";
import AtelierLayout from "./Layout/AtelierLayout";
import COmptableLayout from "./Layout/ComptableLayout";
import AllInvoices from "./pages/AllInvoices";
import UsersList from "./pages/users";
import FormUsers from "./pages/usersForm";
import UpdateUserForm from "./pages/UpdateUser";
import ProduitsView from "./pages/ListProduits";

function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="ajouter-utilisateur" element={<FormUsers />} />
            <Route path="users" element={<UsersList />} />
            <Route path="update-user/:id" element={<UpdateUserForm />} />
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="ajouter-client" element={<ClientForm />} />
            <Route path="modifier-client/:id" element={<UpdateClient />} />
            <Route path="produits" element={<Produits />} />
            <Route path="ajouter-produit" element={<ProduitForm />} />
            <Route path="modifier-produit/:id" element={<UpdateProduit />} />
            <Route path="documents" element={<AllDocuments />} />
            <Route path="ajouter-devis" element={<DevisForm />} />
            <Route path="modifier-produit/:id" element={<PageUpdateDevis />} />
            <Route path="documents/:id" element={<DocumentView />} />
            <Route path="picking-bl" element={<PagePicking />} />
            <Route path="picking-factures" element={<PagePickingInvoice />} />
          </Route>

          <Route path="/commercial" element={<CommercialLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="ajouter-client" element={<ClientForm />} />
            <Route path="modifier-client/:id" element={<UpdateClient />} />
            <Route path="produits" element={<Produits />} />
            <Route path="ajouter-produit" element={<ProduitForm />} />
            <Route path="modifier-produit/:id" element={<UpdateProduit />} />
            <Route path="devis" element={<AllDevis />} />
            <Route path="ajouter-devis" element={<DevisForm />} />
            <Route path="modifier-produit/:id" element={<PageUpdateDevis />} />
            <Route path="documents/:id" element={<DocumentView />} />
          </Route>

          <Route path="/atelier" element={<AtelierLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="produits" element={<ProduitsView />} />
            <Route path="BL" element={<AllDeliveries />} />
            <Route path="documents/:id" element={<DocumentView />} />
            <Route path="picking-bl" element={<PagePicking />} />
          </Route>

          <Route path="/comptable" element={<COmptableLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="produits" element={<ProduitsView />} />
            <Route path="factures" element={<AllInvoices />} />
            <Route path="documents/:id" element={<DocumentView />} />
            <Route path="picking-factures" element={<PagePickingInvoice />} />
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;

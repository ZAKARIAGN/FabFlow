// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Pages
import Login from "./pages/login";
import Signup from "./pages/signup";
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
import PageGestionComptes from "./pages/signup";
import CommercialLayout from "./Layout/CommercialLayout";
import AllDevis from "./pages/AllDevis";
import AllDeliveries from "./pages/AllBL";
import AtelierLayout from "./Layout/AtelierLayout";
import COmptableLayout from "./Layout/ComptableLayout";
import AllInvoices from "./pages/AllInvoices";

function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        


        <Route path="/admin" element={<AdminLayout />}>
        <Route path="gestion-comptes" element={<PageGestionComptes />} />
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="Addclients" element={<ClientForm />} />
          <Route path="updateClient/:id" element={<UpdateClient />} />
          <Route path="produits" element={<Produits />} />
          <Route path="AddProduit" element={<ProduitForm />} />
          <Route path="updateProduit/:id" element={<UpdateProduit />} />
          <Route path="documents" element={<AllDocuments />} />
          <Route path="ajouter-devis" element={<DevisForm />} />
          <Route path="update-devis/:id" element={<PageUpdateDevis />} />
          <Route path="documents/:id" element={<DocumentView />} />
          <Route path="picking-bl" element={<PagePicking />} />
          <Route path="picking-factures" element={<PagePickingInvoice />} />
        </Route>


        <Route path="/commercial" element={<CommercialLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="Addclients" element={<ClientForm />} />
          <Route path="updateClient/:id" element={<UpdateClient />} />
          <Route path="produits" element={<Produits />} />
          <Route path="AddProduit" element={<ProduitForm />} />
          <Route path="updateProduit/:id" element={<UpdateProduit />} />
          <Route path="devis" element={<AllDevis />} />
          <Route path="ajouter-devis" element={<DevisForm />} />
          <Route path="update-devis/:id" element={<PageUpdateDevis />} />
          <Route path="documents/:id" element={<DocumentView />} />
        </Route>


        <Route path="/atelier" element={<AtelierLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="produits" element={<Produits />} />
          <Route path="BL" element={<AllDeliveries />} />
          <Route path="documents/:id" element={<DocumentView />} />
          <Route path="picking-bl" element={<PagePicking />} />
        </Route>


        <Route path="/comptable" element={<COmptableLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="produits" element={<Produits />} />
          <Route path="factures" element={<AllInvoices />} />
          <Route path="documents/:id" element={<DocumentView />} />
          <Route path="picking-factures" element={<PagePickingInvoice />} />
        </Route>


        

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;

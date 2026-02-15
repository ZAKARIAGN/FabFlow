// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./compenet/ProtectedRoute";
import { useState,useEffect } from "react";

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
    
  const [isDark, setIsDark] = useState(() => {
      return localStorage.getItem('theme') === 'dark';
    });
  
   
    useEffect(() => {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }, [isDark]);
    
  return (
    <>

      

      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          
          <Route path="/admin" element={<AdminLayout isDark={isDark} setIsDark={setIsDark}/>}>
            <Route path="ajouter-utilisateur" element={<FormUsers isDark={isDark}  />} />
            <Route path="users" element={<UsersList isDark={isDark} />} />
            <Route path="update-user/:id" element={<UpdateUserForm isDark={isDark} />} />
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard isDark={isDark} />} />
            <Route path="clients" element={<Clients isDark={isDark}/>}  />
            <Route path="ajouter-client" element={<ClientForm isDark={isDark} />} />
            <Route path="modifier-client/:id" element={<UpdateClient isDark={isDark} />} />
            <Route path="produits" element={<Produits isDark={isDark} />} />
            <Route path="ajouter-produit" element={<ProduitForm isDark={isDark} />} />
            <Route path="modifier-produit/:id" element={<UpdateProduit isDark={isDark} />} />
            <Route path="documents" element={<AllDocuments isDark={isDark} />} />
            <Route path="ajouter-devis" element={<DevisForm isDark={isDark} />} />
            <Route path="modifier-devis/:id" element={<PageUpdateDevis isDark={isDark} />} />
            <Route path="documents/:id" element={<DocumentView isDark={isDark} />} />
            <Route path="picking-bl" element={<PagePicking isDark={isDark} />} />
            <Route path="picking-factures" element={<PagePickingInvoice isDark={isDark} />} />
          </Route>

          <Route path="/commercial" element={<CommercialLayout isDark={isDark} setIsDark={setIsDark}/>}>
            {/*<Navbar title={"commercial"}/>*/}
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard isDark={isDark}  />} />
            <Route path="clients" element={<Clients isDark={isDark} />} />
            <Route path="ajouter-client" element={<ClientForm isDark={isDark} />} />
            <Route path="modifier-client/:id" element={<UpdateClient isDark={isDark} />} />
            <Route path="produits" element={<Produits isDark={isDark} />} />
            <Route path="ajouter-produit" element={<ProduitForm isDark={isDark} />} />
            <Route path="modifier-produit/:id" element={<UpdateProduit isDark={isDark} />} />
            <Route path="devis" element={<AllDevis isDark={isDark} />} />
            <Route path="ajouter-devis" element={<DevisForm isDark={isDark} />} />
            <Route path="modifier-devis/:id" element={<PageUpdateDevis isDark={isDark} />} />
            <Route path="documents/:id" element={<DocumentView isDark={isDark} />} />
          </Route>

          <Route path="/atelier" element={<AtelierLayout isDark={isDark} setIsDark={setIsDark}/>}>
            {/* <Navbar title={"atelier"}/>*/}
            <Route index element={<Navigate to="dashboard" isDark={isDark} />} />
            <Route path="dashboard" element={<Dashboard isDark={isDark} />} />
            <Route path="clients" element={<Clients isDark={isDark}/>}  />
            <Route path="produits" element={<ProduitsView isDark={isDark} />} />
            <Route path="BL" element={<AllDeliveries isDark={isDark}/>}  />
            <Route path="documents/:id" element={<DocumentView isDark={isDark} />} />
            <Route path="picking-bl" element={<PagePicking isDark={isDark}/>}  />
          </Route>

          <Route path="/comptable" element={<COmptableLayout isDark={isDark} setIsDark={setIsDark}/>}>
           {/* <Navbar title={"comptable"}/>*/} 
            <Route index element={<Navigate to="dashboard" isDark={isDark} />} />
            <Route path="dashboard" element={<Dashboard isDark={isDark} />} />
            <Route path="clients" element={<Clients isDark={isDark}/>}/>
            <Route path="produits" element={<ProduitsView isDark={isDark} />} />
            <Route path="factures" element={<AllInvoices isDark={isDark}/>}  />
            <Route path="documents/:id" element={<DocumentView isDark={isDark} />} />
            <Route path="picking-factures" element={<PagePickingInvoice isDark={isDark} />} />
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GetDocumentById } from '../services/DoucmentsService';

const DocumentDetails = ({isDark}) => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

 
  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setErrMsg('');
      try {
        const data = await GetDocumentById(id, setErrMsg);
        setDocument(data);
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDocument();
  }, [id]);

  const calculateItemTotal = (item) => {
    const subtotal = item.qtte * parseFloat(item.unit_price);
    const taxAmount = subtotal * (parseFloat(item.tax_rate) / 100);
    return subtotal + taxAmount;
  };

  const calculateSubtotal = () => {
    if (!document?.items) return 0;
    return document.items.reduce((sum, item) => sum + item.qtte * parseFloat(item.unit_price), 0);
  };

  const calculateTotalTax = () => {
    if (!document?.items) return 0;
    return document.items.reduce((sum, item) => sum + (item.qtte * parseFloat(item.unit_price)) * (parseFloat(item.tax_rate)/100), 0);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  const formatCurrency = (amount) => new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-4`}>Chargement...</p>
        </div>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className={`${isDark ? 'bg-red-800 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-700'} px-4 py-3 rounded`}>
          <p className="font-medium">Erreur</p>
          <p>{errMsg}</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className={`${isDark ? 'bg-yellow-800 border-yellow-700 text-yellow-200' : 'bg-yellow-50 border-yellow-200 text-yellow-700'} px-4 py-3 rounded`}>
          <p>Document non trouvé</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    'validé': isDark ? 'bg-green-800 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-200',
    'en attente': isDark ? 'bg-yellow-800 text-yellow-200 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'refusé': isDark ? 'bg-red-800 text-red-200 border-red-700' : 'bg-red-100 text-red-800 border-red-200',
    'brouillon': isDark ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const typeLabels = {
    'quote': 'Devis',
    'invoice': 'Facture',
    'order': 'Commande'
  };

  return (
    <div className={`max-w-5xl mx-auto p-6 min-h-screen ${isDark ? 'bg-gray-900' : ''}`}>
      <div className={`rounded-lg shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        
        {/* Header */}
        <div className={`px-8 py-6 ${isDark ? 'bg-gray-700 text-white' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{typeLabels[document.type] || document.type}</h1>
              <p className={`${isDark ? 'text-gray-300' : 'text-blue-100'} text-lg`}>N° {document.number}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${statusColors[document.status] || statusColors['brouillon']}`}>
                {document.status.toUpperCase()}
              </span>
              <p className={`${isDark ? 'text-gray-300' : 'text-blue-100'} mt-3 text-sm`}>
                Créé le {formatDate(document.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className={`px-8 py-6 border-b ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
          <h2 className={`${isDark ? 'text-gray-200' : 'text-gray-700'} text-lg font-semibold mb-4`}>Informations Client</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>Entreprise</p>
              <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'} text-lg font-semibold`}>{document.client.company_name}</p>
            </div>
            <div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>N° TVA</p>
              <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{document.client.vat_number}</p>
            </div>
            <div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>Adresse</p>
              <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{document.client.address}</p>
            </div>
            <div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mb-1`}>Contact</p>
              <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{document.client.email}</p>
              <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{document.client.tel}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-8 py-6">
          <h2 className={`${isDark ? 'text-gray-200' : 'text-gray-700'} text-lg font-semibold mb-4`}>Articles</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDark ? 'border-gray-600' : 'border-gray-300'} border-b-2`}>
                  <th className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-left py-3 px-4 font-semibold`}>Produit</th>
                  <th className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-center py-3 px-4 font-semibold`}>Type</th>
                  <th className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-center py-3 px-4 font-semibold`}>Unité</th>
                  <th className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-right py-3 px-4 font-semibold`}>Quantité</th>
                  <th className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-right py-3 px-4 font-semibold`}>Prix Unit.</th>
                  <th className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-right py-3 px-4 font-semibold`}>TVA</th>
                  <th className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-right py-3 px-4 font-semibold`}>Total</th>
                </tr>
              </thead>
              <tbody>
                {document.items.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? (isDark ? 'bg-gray-700' : 'bg-gray-50') : (isDark ? 'bg-gray-800' : 'bg-white')} border-b`}>
                    <td className={`${isDark ? 'text-gray-200' : 'text-gray-900'} py-4 px-4 font-medium`}>{item.produit.label}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{item.produit.type}</span>
                    </td>
                    <td className={`${isDark ? 'text-gray-200' : 'text-gray-700'} py-4 px-4 text-center`}>{item.produit.unite}</td>
                    <td className={`${isDark ? 'text-gray-200' : 'text-gray-900'} py-4 px-4 text-right font-medium`}>{item.qtte}</td>
                    <td className={`${isDark ? 'text-gray-200' : 'text-gray-900'} py-4 px-4 text-right`}>{formatCurrency(item.unit_price)}</td>
                    <td className={`${isDark ? 'text-gray-200' : 'text-gray-700'} py-4 px-4 text-right`}>{item.tax_rate}%</td>
                    <td className={`${isDark ? 'text-gray-200' : 'text-gray-900'} py-4 px-4 text-right font-semibold`}>{formatCurrency(calculateItemTotal(item))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className={`px-8 py-6 border-t ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
          <div className="max-w-md ml-auto">
            <div className="flex justify-between py-2 text-gray-700">
              <span>Sous-total HT:</span>
              <span className={`${isDark ? 'text-gray-200' : 'font-medium'}`}>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between py-2 text-gray-700">
              <span>Total TVA:</span>
              <span className={`${isDark ? 'text-gray-200' : 'font-medium'}`}>{formatCurrency(calculateTotalTax())}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-2">
              <span className={`${isDark ? 'text-gray-200' : 'text-lg font-bold text-gray-900'}`}>Total TTC:</span>
              <span className={`${isDark ? 'text-gray-200' : 'text-2xl font-bold text-blue-600'}`}>{formatCurrency(document.totale)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-8 py-4 border-t ${isDark ? 'border-gray-600 bg-gray-800 text-gray-300' : 'border-gray-200 bg-gray-100 text-gray-600'}`}>
          <div className="flex justify-between items-center text-sm">
            <p>Dernière mise à jour: {formatDate(document.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;

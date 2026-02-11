import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GetDocumentById } from '../services/DoucmentsService';

const DocumentDetails = () => {
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

    if (id) {
      fetchDocument();
    }
  }, [id]);

  const calculateItemTotal = (item) => {
    const subtotal = item.qtte * parseFloat(item.unit_price);
    const taxAmount = subtotal * (parseFloat(item.tax_rate) / 100);
    return subtotal + taxAmount;
  };

  const calculateSubtotal = () => {
    if (!document?.items) return 0;
    return document.items.reduce((sum, item) => {
      return sum + (item.qtte * parseFloat(item.unit_price));
    }, 0);
  };

  const calculateTotalTax = () => {
    if (!document?.items) return 0;
    return document.items.reduce((sum, item) => {
      const subtotal = item.qtte * parseFloat(item.unit_price);
      return sum + (subtotal * (parseFloat(item.tax_rate) / 100));
    }, 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Erreur</p>
          <p>{errMsg}</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Document non trouvé</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    'validé': 'bg-green-100 text-green-800 border-green-200',
    'en attente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'refusé': 'bg-red-100 text-red-800 border-red-200',
    'brouillon': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const typeLabels = {
    'quote': 'Devis',
    'invoice': 'Facture',
    'order': 'Commande'
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {typeLabels[document.type] || document.type}
              </h1>
              <p className="text-blue-100 text-lg">N° {document.number}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${statusColors[document.status] || statusColors['brouillon']}`}>
                {document.status.toUpperCase()}
              </span>
              <p className="mt-3 text-blue-100 text-sm">
                Créé le {formatDate(document.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Informations Client</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Entreprise</p>
              <p className="text-lg font-semibold text-gray-900">{document.client.company_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">N° TVA</p>
              <p className="text-gray-900">{document.client.vat_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Adresse</p>
              <p className="text-gray-900">{document.client.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Contact</p>
              <p className="text-gray-900">{document.client.email}</p>
              <p className="text-gray-900">{document.client.tel}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Articles</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Produit</th>
                  <th className="text-center py-3 px-4 text-gray-700 font-semibold">Type</th>
                  <th className="text-center py-3 px-4 text-gray-700 font-semibold">Unité</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">Quantité</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">Prix Unit.</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">TVA</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {document.items.map((item, index) => (
                  <tr key={item.id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{item.produit.label}</p>
                      <p className="text-sm text-gray-500">ID: {item.produit.id}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {item.produit.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-700">
                      {item.produit.unite}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-900 font-medium">
                      {item.qtte}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-900">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-700">
                      {item.tax_rate}%
                    </td>
                    <td className="py-4 px-4 text-right text-gray-900 font-semibold">
                      {formatCurrency(calculateItemTotal(item))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <div className="max-w-md ml-auto">
            <div className="flex justify-between py-2 text-gray-700">
              <span>Sous-total HT:</span>
              <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between py-2 text-gray-700">
              <span>Total TVA:</span>
              <span className="font-medium">{formatCurrency(calculateTotalTax())}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-2">
              <span className="text-lg font-bold text-gray-900">Total TTC:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(document.totale)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-100 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>Dernière mise à jour: {formatDate(document.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
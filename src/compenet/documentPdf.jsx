import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Format price
const formatPrice = (value) => {
  const number = Number(value || 0);
  return number
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
};
// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#094067',
    paddingBottom: 10
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#094067',
    textTransform: 'uppercase'
  },

  label: {
    fontSize: 8,
    color: '#90b4ce',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: 'bold'
  },

  info: {
    fontSize: 11,
    marginBottom: 2
  },

  /* Client Section */
  clientSection: {
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },

  clientBox: {
    width: '50%',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#094067'
  },

  clientTitle: {
    fontSize: 9,
    color: '#094067',
    marginBottom: 6,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },

  clientText: {
    fontSize: 11,
    marginBottom: 3
  },

  /* Table */
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    minHeight: 30,
    alignItems: 'center'
  },

  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold'
  },

  col1: {
    width: '40%',
    paddingLeft: 5
  },

  col2: {
    width: '20%',
    textAlign: 'center'
  },

  col3: {
    width: '20%',
    textAlign: 'right'
  },

  col4: {
    width: '20%',
    textAlign: 'right',
    paddingRight: 5
  },

  /* Total */
  totalSection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },

  totalBox: {
    width: 200,
    backgroundColor: '#094067',
    padding: 15,
    borderRadius: 8,
    color: 'white'
  },

  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10
  }
});

const DocumentPDF = ({ doc }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              {doc.type === 'quote'
                ? "DEVIS"
                : doc.type === 'delivery'
                ? "BON DE LIVRAISON"
                : "FACTURE"}
            </Text>
            <Text style={{ color: '#5f6c7b', marginTop: 5 }}>
              N° {doc.number}
            </Text>
          </View>

          <View style={{ textAlign: 'right' }}>
            <Text style={styles.label}>Date d'émission</Text>
            <Text>
              {new Date(doc.created_at).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        {/* Client Section */}
        <View style={styles.clientSection}>
          <View style={styles.clientBox}>
            <Text style={styles.clientTitle}>
              Destinataire (Client)
            </Text>
            <Text style={[styles.clientText, { fontWeight: 'bold' }]}>
              Client Nom : {doc.client?.company_name}
            </Text>
            <Text style={styles.clientText}>
              Address : {doc.client?.address}
            </Text>
            <Text style={styles.clientText}>
              Vat Number: {doc.client?.vat_number}
            </Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.col1}>Désignation</Text>
            <Text style={styles.col2}>Qté</Text>
            <Text style={styles.col3}>P.U (DH)</Text>
            <Text style={styles.col4}>Total HT</Text>
          </View>

          {doc.items?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>
                {item.produit?.label}
              </Text>
              <Text style={styles.col2}>
                {item.qtte}
              </Text>
              <Text style={styles.col3}>
                {formatPrice(item.unit_price)}
              </Text>
              <Text style={styles.col4}>
                {formatPrice(item.unit_price * item.qtte)}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <Text
              style={{
                fontSize: 8,
                opacity: 0.8,
                textTransform: 'uppercase',
                marginBottom: 5
              }}
            >
              Total Net à Payer
            </Text>

            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {formatPrice(doc.totale)} DH
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text
            style={{
              fontSize: 8,
              color: '#90b4ce',
              textAlign: 'center'
            }}
          >
            Merci pour votre confiance. Ce document est généré informatiquement.
          </Text>
        </View>

      </Page>
    </Document>
  );
};

export default DocumentPDF;

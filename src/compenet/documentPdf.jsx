import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#333' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, borderBottom: 2, borderBottomColor: '#094067', pb: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#094067', textTransform: 'uppercase' },
  section: { marginBottom: 20 },
  label: { fontSize: 8, color: '#90b4ce', textTransform: 'uppercase', marginBottom: 4, fontWeight: 'bold' },
  info: { fontSize: 11, marginBottom: 2 },
  table: { display: 'table', width: 'auto', marginTop: 20, borderStyle: 'solid', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tableRow: { flexDirection: 'row', borderBottomColor: '#eee', borderBottomWidth: 1, minHeight: 30, alignItems: 'center' },
  tableHeader: { backgroundColor: '#f8fafc', fontWeight: 'bold' },
  col1: { width: '40%', paddingLeft: 5 },
  col2: { width: '20%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right', paddingRight: 5 },
  totalSection: { marginTop: 30, flexDirection: 'row', justifyContent: 'flex-end' },
  totalBox: { width: 180, backgroundColor: '#094067', padding: 15, borderRadius: 8, color: 'white' }
});

const DocumentPDF = ({ doc }) => {
  // تحديد العنوان بناءً على النوع
  const getTitle = () => {
    if (doc.category === 'quote') return "DEVIS";
    if (doc.category === 'delivery') return "BON DE LIVRAISON";
    return "FACTURE";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{getTitle()}</Text>
            <Text style={{ color: '#5f6c7b', marginTop: 5 }}>N° {doc.number}</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={styles.label}>Date d'émission</Text>
            <Text>{new Date(doc.created_at).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Client & Company Info */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
          <View style={{ width: '45%' }}>
            <Text style={styles.label}>Émetteur</Text>
            <Text style={[styles.info, { fontWeight: 'bold' }]}>VOTRE ENTREPRISE</Text>
            <Text style={styles.info}>Zone Industrielle, Mohammedia</Text>
            <Text style={styles.info}>Contact: contact@entreprise.ma</Text>
          </View>
          <View style={{ width: '45%', textAlign: 'right' }}>
            <Text style={styles.label}>Destinaire (Client)</Text>
            <Text style={[styles.info, { fontWeight: 'bold' }]}>{doc.client?.company_name}</Text>
            <Text style={styles.info}>{doc.client?.address}</Text>
            <Text style={styles.info}>ICE: {doc.client?.vat_number}</Text>
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
              <Text style={styles.col1}>{item.produit?.label}</Text>
              <Text style={styles.col2}>{item.qtte}</Text>
              <Text style={styles.col3}>{Number(item.unit_price).toLocaleString()}</Text>
              <Text style={styles.col4}>{(item.unit_price * item.qtte).toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <Text style={{ fontSize: 8, opacity: 0.8, textTransform: 'uppercase', marginBottom: 5 }}>Total Net à Payer</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {Number(doc.totale).toLocaleString()} DH
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={{ position: 'absolute', bottom: 40, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#eee', pt: 10 }}>
          <Text style={{ fontSize: 8, color: '#90b4ce', textAlign: 'center' }}>
            Merci pour votre confiance. Ce document est généré informatiquement.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default DocumentPDF;
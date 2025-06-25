'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

interface Props {
  invoice: any;
  items: any[];
}

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12 },
  heading: { fontSize: 18, marginBottom: 12 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 4 },
  cellDesc: { flex: 2 },
  cell: { flex: 1, textAlign: 'right' },
});

function InvoicePDF({ invoice, items }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Invoice #{invoice.number ?? invoice.id}</Text>
        <Text>Status: {invoice.status}</Text>
        <Text>Issue: {invoice.issue_date}</Text>
        <Text>Due: {invoice.due_date}</Text>

        <View style={{ marginTop: 16 }}>
          {items.map((it: any, idx: number) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.cellDesc}>{it.description}</Text>
              <Text style={styles.cell}>{it.quantity}</Text>
              <Text style={styles.cell}>${it.unit_price}</Text>
              <Text style={styles.cell}>{it.tax_rate}%</Text>
              <Text style={styles.cell}>${Number(it.line_total).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 16 }}>
          <Text>Total: ${invoice.total}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default function InvoicePDFDownload({ invoice, items }: Props) {
  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} items={items} />}
      fileName={`invoice_${invoice.number ?? invoice.id}.pdf`}
      className="rounded border px-3 py-1 text-indigo-600 hover:bg-gray-50"
    >
      PDF
    </PDFDownloadLink>
  );
} 
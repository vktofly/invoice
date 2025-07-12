'use client';

import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register a font. This is important for consistent rendering.
// In a real app, you'd host the font file with your project.
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/v11/KFOmCnqEu92Fr1Me5Q.ttf' },
    { src: 'https://fonts.gstatic.com/s/helvetica/v11/KFOnCnqEu92Fr1Me5Q.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 40,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  companyAddress: {
    fontSize: 10,
    color: '#4b5563',
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  address: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 10,
    color: '#4b5563',
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
  },
  descriptionCell: {
    width: '40%',
  },
  quantityCell: {
    width: '15%',
    textAlign: 'center',
  },
  priceCell: {
    width: '20%',
    textAlign: 'right',
  },
  totalCell: {
    width: '25%',
    textAlign: 'right',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  summaryContainer: {
    width: '40%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 11,
  },
  summaryValue: {
    fontSize: 11,
    textAlign: 'right',
  },
  summaryTotal: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#6b7280',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});

function InvoicePDF({ invoice }: { invoice: any }) {
  const currencySymbol = invoice.currency === 'INR' ? '₹' : '$';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyDetails}>
            {invoice.logo_url && <Image src={invoice.logo_url} style={styles.logo} />}
            <Text style={styles.companyName}>{invoice.user_company_name || 'Your Company'}</Text>
            <Text style={styles.companyAddress}>{invoice.user_address || '123 Main St, Anytown, USA'}</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}># {invoice.number}</Text>
          </View>
        </View>

        {/* Billing and Shipping Info */}
        <View style={styles.section}>
          <View style={styles.address}>
            <Text style={styles.addressTitle}>Billed To:</Text>
            <Text style={styles.addressText}>{invoice.customers.name}</Text>
            <Text style={styles.addressText}>{invoice.billing_address?.address_line1}</Text>
            <Text style={styles.addressText}>
              {invoice.billing_address?.city}, {invoice.billing_address?.state} {invoice.billing_address?.postal_code}
            </Text>
          </View>
          <View style={{...styles.address, textAlign: 'right'}}>
            <Text style={styles.addressTitle}>Invoice Date:</Text>
            <Text style={styles.addressText}>{new Date(invoice.issue_date).toLocaleDateString()}</Text>
            <Text style={styles.addressTitle}>Due Date:</Text>
            <Text style={styles.addressText}>{new Date(invoice.due_date).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Invoice Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={{...styles.tableHeaderCell, ...styles.descriptionCell}}>Item Description</Text>
            <Text style={{...styles.tableHeaderCell, ...styles.quantityCell}}>Qty</Text>
            <Text style={{...styles.tableHeaderCell, ...styles.priceCell}}>Price</Text>
            <Text style={{...styles.tableHeaderCell, ...styles.totalCell}}>Total</Text>
          </View>
          {invoice.invoice_items.map((item: any) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={{...styles.tableCell, ...styles.descriptionCell}}>{item.description}</Text>
              <Text style={{...styles.tableCell, ...styles.quantityCell}}>{item.quantity}</Text>
              <Text style={{...styles.tableCell, ...styles.priceCell}}>{currencySymbol}{item.unit_price.toFixed(2)}</Text>
              <Text style={{...styles.tableCell, ...styles.totalCell}}>{currencySymbol}{item.line_total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{currencySymbol}{invoice.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax ({invoice.tax_rate || 0}%)</Text>
              <Text style={styles.summaryValue}>{currencySymbol}{invoice.tax_amount.toFixed(2)}</Text>
            </View>
            <View style={{...styles.summaryRow, ...styles.summaryTotal}}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>{currencySymbol}{invoice.total_amount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business!
        </Text>
      </Page>
    </Document>
  );
}

export default InvoicePDF;

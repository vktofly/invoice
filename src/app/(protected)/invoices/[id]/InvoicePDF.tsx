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
  th: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    flexGrow: 1,
  },
  td: {
    padding: 8,
    fontSize: 10,
    flexGrow: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  totals: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    paddingVertical: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  balanceDue: {
    color: '#4f46e5',
  },
  notes: {
    marginTop: 10,
    fontSize: 10,
    color: '#374151',
  },
  signature: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  signatureText: {
    fontStyle: 'italic',
    fontSize: 12,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});

const getCurrencySymbol = (currency: string) => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };
  return symbols[currency] || currency;
};

interface InvoicePDFProps {
  invoice: {
    number: string;
    issue_date: string;
    due_date: string;
    items: any[];
    notes: string | null | undefined;
    logo_url: string | null | undefined;
    color_theme: string | null | undefined;
    user_company_name: string | null | undefined;
    user_address: string | null | undefined;
    user_contact: string | null | undefined;
    currency: string | null | undefined;
    authorized_signature: string | null | undefined;
    billing_address: any;
    shipping_address: any;
    customers: any;
    subtotal: number;
    total_item_discount: number;
    tax_amount: number;
    overall_discount: number;
    total_amount: number;
    balance_due: number;
    currency_symbol: string;
    shipping_cost?: number;
    custom_fields?: Array<{ key: string; value: string; }>;
  };
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  const currencySymbol = getCurrencySymbol(invoice.currency || 'USD');

  // Safely parse custom_fields
  let customFields = [];
  if (invoice.custom_fields) {
    try {
      if (typeof invoice.custom_fields === 'string') {
        customFields = JSON.parse(invoice.custom_fields);
      } else if (Array.isArray(invoice.custom_fields)) {
        customFields = invoice.custom_fields;
      }
    } catch (error) {
      console.error("Failed to parse custom_fields:", error);
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ ...styles.header, borderBottomColor: invoice.color_theme || '#4f46e5' }}>
          <View>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            {invoice.logo_url && <Image src={invoice.logo_url} style={styles.logo} />}
            <Text style={styles.companyName}>{invoice.user_company_name || 'Your Company'}</Text>
            <Text style={styles.companyAddress}>{invoice.user_address || 'Your Address'}</Text>
            <Text style={styles.companyAddress}>{invoice.user_contact || 'your-email@example.com'}</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ ...styles.invoiceTitle, color: invoice.color_theme || '#4f46e5' }}>INVOICE</Text>
            <Text style={styles.invoiceNumber}># {invoice.number}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View>
            <Text>{invoice.customers?.name}</Text>
            {invoice.billing_address && (
              <>
                <Text>{invoice.billing_address.address_line1}</Text>
                {invoice.billing_address.address_line2 && <Text>{invoice.billing_address.address_line2}</Text>}
                <Text>{invoice.billing_address.city}, {invoice.billing_address.state} {invoice.billing_address.postal_code}</Text>
              </>
            )}
          </View>
          <View style={{ textAlign: 'right' }}>
            {invoice.shipping_address ? (
              <>
                <Text>{invoice.shipping_address.address_line1}</Text>
                {invoice.shipping_address.address_line2 && <Text>{invoice.shipping_address.address_line2}</Text>}
                <Text>{invoice.shipping_address.city}, {invoice.shipping_address.state} {invoice.shipping_address.postal_code}</Text>
              </>
            ) : <Text>N/A</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <View>
            <Text>{invoice.issue_date}</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text>{invoice.due_date}</Text>
          </View>
        </View>

        {customFields && customFields.length > 0 && (
          <View style={styles.section}>
            {customFields.map((field, index) => (
              <View key={index}>
                <Text>{field.key}:</Text>
                <Text>{field.value}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.table}>
          <View style={{ ...styles.tableHeader, backgroundColor: invoice.color_theme || '#4f46e5' }}>
            <Text style={styles.th}>Description</Text>
            <Text style={styles.th}>Qty</Text>
            <Text style={styles.th}>Price</Text>
            <Text style={styles.th}>Tax (%)</Text>
            <Text style={styles.th}>Discount</Text>
            <Text style={{...styles.th, textAlign: 'right'}}>Total</Text>
          </View>
          {(invoice.items || []).map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.td}>{item.description || '-'}</Text>
              <Text style={styles.td}>{item.quantity ?? 0}</Text>
              <Text style={styles.td}>{currencySymbol}{(item.unit_price ?? 0).toFixed(2)}</Text>
              <Text style={styles.td}>{(item.tax_rate ?? 0).toFixed(2)}%</Text>
              <Text style={styles.td}>{currencySymbol}{(item.discount_amount ?? 0).toFixed(2)}</Text>
              <Text style={{...styles.td, textAlign: 'right'}}>{currencySymbol}{(item.line_total ?? 0).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>{currencySymbol}{(invoice.subtotal || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Item Discounts:</Text>
            <Text>-{currencySymbol}{(invoice.total_item_discount || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Tax:</Text>
            <Text>{currencySymbol}{(invoice.tax_amount || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Shipping:</Text>
            <Text>{currencySymbol}{(invoice.shipping_cost || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Discount:</Text>
            <Text>-{currencySymbol}{(invoice.overall_discount || 0).toFixed(2)}</Text>
          </View>
          <View style={{...styles.totalRow, ...styles.bold, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderColor: '#EEE' }}>
            <Text>Invoice Total:</Text>
            <Text>{currencySymbol}{(invoice.total_amount || 0).toFixed(2)}</Text>
          </View>
          <View style={{...styles.totalRow, ...styles.bold, ...styles.balanceDue, color: invoice.color_theme || '#4f46e5' }}>
            <Text>Balance Due:</Text>
            <Text>{currencySymbol}{(invoice.balance_due || 0).toFixed(2)}</Text>
          </View>
        </View>

        {invoice.notes && (
          <View style={styles.notes}>
            <Text>Notes:</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        {invoice.authorized_signature && (
          <View style={styles.signature}>
            <Text style={styles.signatureText}>{invoice.authorized_signature}</Text>
            <Text>Authorized Signature</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
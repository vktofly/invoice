'use client';

import { Customer } from '@/lib/types';
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
    backgroundColor: '#ffffff',
    color: '#1f2937', // text-gray-800
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 2,
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937', // text-gray-800
  },
  companyAddress: {
    fontSize: 10,
    color: '#4b5563', // text-gray-600
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#4b5563', // text-gray-600
    textAlign: 'right',
    marginTop: 2,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  customerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addressBlock: {
    width: '48%',
  },
  addressTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1f2937',
  },
  addressText: {
    fontSize: 10,
    color: '#4b5563',
  },
  rightAlign: {
    textAlign: 'right',
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  table: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    color: '#ffffff',
  },
  th: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    flexGrow: 1,
  },
  thDescription: { flex: 3 },
  thQty: { flex: 1, textAlign: 'center' },
  thPrice: { flex: 1, textAlign: 'right' },
  thTax: { flex: 1, textAlign: 'right' },
  thDiscount: { flex: 1, textAlign: 'right' },
  thTotal: { flex: 1, textAlign: 'right' },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // border-gray-200
    alignItems: 'center',
  },
  td: {
    padding: 8,
    fontSize: 10,
    flexGrow: 1,
  },
  tdDescription: { flex: 3 },
  tdQty: { flex: 1, textAlign: 'center' },
  tdPrice: { flex: 1, textAlign: 'right' },
  tdTax: { flex: 1, textAlign: 'right' },
  tdDiscount: { flex: 1, textAlign: 'right' },
  tdTotal: { flex: 1, textAlign: 'right', fontWeight: 'bold' },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  totalsContainer: {
    width: '45%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  totalLabel: {
    fontSize: 10,
    color: '#4b5563',
  },
  totalValue: {
    fontSize: 10,
    color: '#1f2937',
  },
  bold: {
    fontWeight: 'bold',
  },
  totalWithBorder: {
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    marginTop: 4,
    paddingTop: 4,
  },
  balanceDueRow: {
    borderTopWidth: 2,
    marginTop: 8,
    paddingTop: 8,
  },
  balanceDueLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  balanceDueValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  notesSection: {
    marginTop: 20,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 10,
    color: '#4b5563',
  },
  signatureSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  signatureText: {
    fontSize: 12,
    // A font like 'Dancing Script' would need to be registered.
    // Sticking to Helvetica for now.
  },
  signatureLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
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

// Utility to get customer display name
const getCustomerDisplayName = (customer: any) =>
  customer?.name ||
  [customer?.first_name, customer?.last_name].filter(Boolean).join(' ') ||
  customer?.company_name ||
  customer?.email ||
  customer?.id;

interface InvoicePDFProps {
  invoice: any;
  customer?: any;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, customer }) => {
  const customerData = customer || invoice.customer;
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
        {/* Header */}
        <View style={{ ...styles.header, borderBottomColor: invoice.color_theme || '#4f46e5' }}>
          <View style={styles.companyDetails}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            {invoice.logo_url && <Image src={invoice.logo_url} style={styles.logo} />}
            <Text style={styles.companyName}>{invoice.user_company_name || 'Your Company'}</Text>
            <Text style={styles.companyAddress}>{invoice.user_address || '123 Your Street, Your City, 12345'}</Text>
            <Text style={styles.companyAddress}>{invoice.user_contact || 'your.email@example.com'}</Text>
          </View>
          <View>
            <Text style={{ ...styles.invoiceTitle, color: invoice.color_theme || '#4f46e5' }}>INVOICE</Text>
            <Text style={styles.invoiceNumber}># {invoice.number}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.customerSection}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressTitle}>Billed To:</Text>
            <Text style={styles.addressText}>{getCustomerDisplayName(customerData) || 'N/A'}</Text>
            {invoice.billing_address && (
              <>
                <Text style={styles.addressText}>{invoice.billing_address.address_line1}</Text>
                {invoice.billing_address.address_line2 && <Text style={styles.addressText}>{invoice.billing_address.address_line2}</Text>}
                <Text style={styles.addressText}>{invoice.billing_address.city}, {invoice.billing_address.state} {invoice.billing_address.postal_code}</Text>
              </>
            )}
          </View>
          <View style={[styles.addressBlock, { textAlign: 'right' }]}>
            <Text style={[styles.addressTitle, styles.rightAlign]}>Shipped To:</Text>
            {invoice.shipping_address ? (
              <>
                <Text style={styles.addressText}>{invoice.shipping_address.address_line1}</Text>
                {invoice.shipping_address.address_line2 && <Text style={styles.addressText}>{invoice.shipping_address.address_line2}</Text>}
                <Text style={styles.addressText}>{invoice.shipping_address.city}, {invoice.shipping_address.state} {invoice.shipping_address.postal_code}</Text>
              </>
            ) : <Text style={styles.addressText}>N/A</Text>}
          </View>
        </View>

        {/* Invoice Dates */}
        <View style={styles.detailsSection}>
            <View>
                <Text style={styles.addressTitle}>Invoice Date:</Text>
                <Text style={styles.addressText}>{invoice.issue_date}</Text>
            </View>
            <View style={{textAlign: 'right'}}>
                <Text style={[styles.addressTitle, styles.rightAlign]}>Due Date:</Text>
                <Text style={styles.addressText}>{invoice.due_date}</Text>
            </View>
        </View>

        {/* Recurring Information */}
        {invoice.is_recurring && (
            <View style={{...styles.customerSection, backgroundColor: '#f9fafb', padding: 10, borderRadius: 6, marginBottom: 20}}>
                <View style={styles.addressBlock}>
                    <Text style={styles.addressTitle}>Recurring Info</Text>
                    <Text style={styles.addressText}>Frequency: <Text style={styles.bold}>{invoice.recurring_frequency}</Text></Text>
                </View>
                <View style={[styles.addressBlock, { textAlign: 'right' }]}>
                    <Text style={[styles.addressTitle, styles.rightAlign]}>Period</Text>
                    <Text style={styles.addressText}>{invoice.recurring_start_date} to {invoice.recurring_end_date || 'Ongoing'}</Text>
                </View>
            </View>
        )}

        {/* Items Table */}
        <View style={styles.table}>
          <View style={{ ...styles.tableHeader, backgroundColor: invoice.color_theme || '#4f46e5' }}>
            <Text style={[styles.th, styles.thDescription]}>Description</Text>
            <Text style={[styles.th, styles.thQty]}>Qty</Text>
            <Text style={[styles.th, styles.thPrice]}>Price</Text>
            <Text style={[styles.th, styles.thTax]}>Tax (%)</Text>
            <Text style={[styles.th, styles.thDiscount]}>Discount</Text>
            <Text style={[styles.th, styles.thTotal]}>Total</Text>
          </View>
          {(invoice.invoice_items || []).map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.td, styles.tdDescription]}>{item.description || '-'}</Text>
              <Text style={[styles.td, styles.tdQty]}>{item.quantity ?? 0}</Text>
              <Text style={[styles.td, styles.tdPrice]}>{currencySymbol}{(item.unit_price ?? 0).toFixed(2)}</Text>
              <Text style={[styles.td, styles.tdTax]}>{(item.tax_rate ?? 0).toFixed(2)}%</Text>
              <Text style={[styles.td, styles.tdDiscount]}>{currencySymbol}{(item.discount_amount ?? 0).toFixed(2)}</Text>
              <Text style={[styles.td, styles.tdTotal]}>{currencySymbol}{(item.line_total ?? 0).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
            <View style={styles.totalsContainer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal:</Text>
                    <Text style={styles.totalValue}>{currencySymbol}{(invoice.subtotal || 0).toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Item Discounts:</Text>
                    <Text style={styles.totalValue}>-{currencySymbol}{(invoice.total_item_discount || 0).toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tax:</Text>
                    <Text style={styles.totalValue}>{currencySymbol}{(invoice.tax_amount || 0).toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Shipping:</Text>
                    <Text style={styles.totalValue}>{currencySymbol}{(invoice.shipping_cost || 0).toFixed(2)}</Text>
                </View>
                <View style={[styles.totalRow, styles.totalWithBorder]}>
                    <Text style={[styles.totalLabel, styles.bold]}>Total:</Text>
                    <Text style={[styles.totalValue, styles.bold]}>{currencySymbol}{(invoice.total_amount || 0).toFixed(2)}</Text>
                </View>
                <View style={[styles.totalRow, styles.balanceDueRow, { borderTopColor: invoice.color_theme || '#4f46e5' }]}>
                    <Text style={[styles.balanceDueLabel, { color: invoice.color_theme || '#4f46e5' }]}>Balance Due:</Text>
                    <Text style={[styles.balanceDueValue, { color: invoice.color_theme || '#4f46e5' }]}>{currencySymbol}{(invoice.balance_due || 0).toFixed(2)}</Text>
                </View>
            </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Signature */}
        {invoice.authorized_signature && (
          <View style={styles.signatureSection}>
            <Text style={styles.signatureText}>{invoice.authorized_signature}</Text>
            <Text style={styles.signatureLabel}>Authorized Signature</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
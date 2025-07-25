"use client";
import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the InvoicePDFDownload component (client-side only)
const InvoicePDFDownload = dynamic(() => import("./InvoicePDFDownload"), { ssr: false });

interface InvoicePDFDownloadWrapperProps {
  invoice: any;
  items: any[];
}

export default function InvoicePDFDownloadWrapper({ invoice, items }: InvoicePDFDownloadWrapperProps) {
  return <InvoicePDFDownload invoice={invoice} items={items} />;
} 
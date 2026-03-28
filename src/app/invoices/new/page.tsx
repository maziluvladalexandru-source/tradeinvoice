"use client";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import UpgradeModal, { ProBadge } from "@/components/UpgradeModal";
import { COUNTRY_CONFIGS, getCountryConfig, formatComplianceFooter } from "@/lib/country-config";
// CountryConfig type used via getCountryConfig return

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  vatNumber: string | null;
}

interface UserProfile {
  businessName: string | null;
  name: string | null;
  email: string;
  businessAddress: string | null;
  businessPhone: string | null;
  kvkNumber: string | null;
  vatNumber: string | null;
  bankDetails: string | null;
  logoUrl: string | null;
  plan: string;
}

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface BankDetailsStructured {
  iban: string;
  bankName: string;
  bic: string;
  accountHolder: string;
}

function formatIBAN(value: string): string {
  const clean = value.replace(/\s/g, "").toUpperCase();
  return clean.replace(/(.{4})/g, "$1 ").trim();
}

function parseBankDetails(raw: string | null): BankDetailsStructured | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.iban !== undefined) return parsed;
  } catch {
    // Legacy format
  }
  return null;
}

const COMMON_ITEMS = [
  { label: "Labour", desc: "Labour - general work" },
  { label: "Callout", desc: "Emergency callout fee" },
  { label: "Materials", desc: "Materials and supplies" },
  { label: "Bathroom", desc: "Bathroom renovation - labour" },
  { label: "Boiler", desc: "Boiler service and repair" },
  { label: "Electrical", desc: "Electrical installation work" },
  { label: "Plastering", desc: "Plastering and finishing" },
  { label: "Painting", desc: "Painting and decorating" },
];

const PAYMENT_TERMS = [
  { label: "Due on receipt", days: 0 },
  { label: "Net 14 (14 days)", days: 14 },
  { label: "Net 30 (30 days)", days: 30 },
  { label: "Net 45 (45 days)", days: 45 },
  { label: "Net 60 (60 days)", days: 60 },
  { label: "Custom date", days: -1 },
];

function calculateDueDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function NewInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950">
          <Navbar />
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="h-10 w-48 bg-gray-800 rounded-xl animate-pulse mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-900/50 rounded-2xl p-5 border border-gray-800/50">
                  <div className="h-5 w-32 bg-gray-800 rounded animate-pulse mb-3" />
                  <div className="h-12 bg-gray-800/30 rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <NewInvoiceForm />
    </Suspense>
  );
}

// ─── Live Preview Component ─────────────────────────────────────────────────
function InvoicePreview({
  invoiceNumber,
  invoiceType,
  description,
  currency,
  dueDate,
  serviceDate,
  taxRate,
  reverseCharge,
  paymentNotes,
  notesToClient,
  lineItems,
  selectedClient,
  referenceInvoice,
  user,
  invoiceCountry,
}: {
  invoiceNumber: string;
  invoiceType: string;
  description: string;
  currency: string;
  dueDate: string;
  serviceDate: string;
  taxRate: number;
  reverseCharge: boolean;
  paymentNotes: string;
  notesToClient: string;
  lineItems: LineItem[];
  selectedClient: Client | undefined;
  referenceInvoice: string;
  user: UserProfile | null;
  invoiceCountry: string;
}) {
  const countryConfig = getCountryConfig(invoiceCountry);
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(n);

  const fmtDate = (d: string) => {
    if (!d) return "--";
    return new Date(d + "T00:00:00").toLocaleDateString("en-IE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const today = new Date().toISOString().split("T")[0];
  const docLabel =
    invoiceType === "quote"
      ? "Quote"
      : invoiceType === "credit_note"
      ? "Credit Note"
      : "Invoice";

  const validItems = lineItems.filter((i) => i.description || i.unitPrice > 0);
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const bankData = parseBankDetails(user?.bankDetails || null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-gray-900 text-sm">
      {/* Header */}
      <header className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {user?.logoUrl ? (
            <img src={user.logoUrl} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-white leading-none">
                {(user?.businessName || user?.name || "?").charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {user?.businessName || user?.name || "Your Business"}
            </h2>
            <div className="text-gray-400 text-xs space-y-0.5">
              {user?.businessAddress && <p>{user.businessAddress}</p>}
              <p>
                {user?.email || "your@email.com"}
                {user?.businessPhone && ` · ${user.businessPhone}`}
              </p>
            </div>
          </div>
        </div>
        {(user?.kvkNumber || user?.vatNumber) && (
          <div className="text-[10px] text-gray-400 text-right space-y-0.5 mt-1">
            {user.kvkNumber && <p>{countryConfig.businessRegLabel}: {user.kvkNumber}</p>}
            {user.vatNumber && <p>{countryConfig.taxIdLabel}: {user.vatNumber}</p>}
          </div>
        )}
      </header>

      {/* Invoice Info + Bill To */}
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6">
          {/* Meta */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
              {docLabel}
            </p>
            <p className="text-base sm:text-xl font-bold text-gray-900 font-mono tracking-tight break-all">
              {invoiceNumber || "INV-0000"}
            </p>
            {description && (
              <p className="text-gray-500 text-xs mt-0.5 truncate">
                {description}
              </p>
            )}
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex gap-2">
                <span className="text-gray-400 shrink-0">Issued</span>
                <span className="text-gray-700 font-medium whitespace-nowrap">
                  {fmtDate(today)}
                </span>
              </div>
              {serviceDate && (
                <div className="flex gap-2">
                  <span className="text-gray-400 shrink-0">{countryConfig.serviceDateLabel}</span>
                  <span className="text-gray-700 font-medium whitespace-nowrap">
                    {fmtDate(serviceDate)}
                  </span>
                </div>
              )}
              {invoiceCountry === "DE" && serviceDate && serviceDate === today && (
                <p className="text-[10px] text-amber-600 italic mt-0.5">
                  {countryConfig.serviceDateNote}
                </p>
              )}
              <div className="flex gap-2">
                <span className="text-gray-400 shrink-0">Due</span>
                <span className="text-gray-700 font-medium whitespace-nowrap">
                  {fmtDate(dueDate)}
                </span>
              </div>
            </div>
            {invoiceType === "credit_note" && referenceInvoice && (
              <p className="text-xs text-gray-400 mt-2">
                Ref: {referenceInvoice}
              </p>
            )}
          </div>

          {/* Bill To */}
          <div className="text-left sm:text-right flex-shrink-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Bill To
            </p>
            {selectedClient ? (
              <>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedClient.name}
                </p>
                <p className="text-gray-500 text-xs">{selectedClient.email}</p>
                {selectedClient.address && (
                  <p className="text-gray-500 text-xs mt-0.5 whitespace-pre-line">
                    {selectedClient.address}
                  </p>
                )}
                {selectedClient.vatNumber && (
                  <p className="text-gray-500 text-xs mt-0.5">
                    VAT: {selectedClient.vatNumber}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-300 text-xs italic">No client selected</p>
            )}
          </div>
        </div>
      </div>

      {/* Notes to Client */}
      {notesToClient && (
        <div className="px-6 pb-4">
          <div className="bg-blue-50 rounded-lg border border-blue-200/80 p-3">
            <p className="text-[10px] font-semibold text-blue-900 mb-0.5">
              Note
            </p>
            <p className="text-blue-800 text-xs whitespace-pre-line leading-relaxed">
              {notesToClient}
            </p>
          </div>
        </div>
      )}

      {/* Line Items Table */}
      <div className="px-4 sm:px-6">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-y border-gray-200 bg-gray-50/50">
              <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 py-2 pr-2">
                Description
              </th>
              <th className="text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500 py-2 px-2 w-12">
                Qty
              </th>
              <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500 py-2 px-2 w-20">
                Price
              </th>
              <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500 py-2 pl-2 w-20">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {validItems.length > 0 ? (
              validItems.map((item, idx) => (
                <tr
                  key={idx}
                  className={
                    idx < validItems.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }
                >
                  <td className="text-gray-800 text-xs py-2.5 pr-2 truncate max-w-[120px]">
                    {item.description || "--"}
                  </td>
                  <td className="text-gray-500 text-xs text-center py-2.5 px-2 tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="text-gray-500 text-xs text-right py-2.5 px-2 tabular-nums">
                    {fmt(item.unitPrice)}
                  </td>
                  <td className="text-gray-900 text-xs font-medium text-right py-2.5 pl-2 tabular-nums">
                    {fmt(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-300 text-xs py-6 italic"
                >
                  Add line items to see them here
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="border-t border-gray-200 py-4">
          <div className="flex flex-col items-end space-y-1">
            <div className="w-full max-w-[200px] flex justify-between text-xs">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-gray-700 tabular-nums">{fmt(subtotal)}</span>
            </div>
            {taxRate > 0 && (
              <div className="w-full max-w-[200px] flex justify-between text-xs">
                <span className="text-gray-400">VAT ({taxRate}%)</span>
                <span className="text-gray-700 tabular-nums">{fmt(tax)}</span>
              </div>
            )}
            {reverseCharge && (
              <div className="w-full max-w-[200px]">
                <p className="text-[10px] text-amber-600 italic">
                  {countryConfig.reverseChargeText}
                </p>
              </div>
            )}
            <div className="w-full max-w-[200px] flex justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-base sm:text-lg font-bold text-gray-900 tabular-nums">
                {fmt(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details - Structured */}
      {bankData && (bankData.iban || bankData.bankName) && (
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
            <p className="text-[10px] font-semibold text-gray-600 mb-1.5">
              Payment Information
            </p>
            <div className="space-y-0.5 text-xs">
              {bankData.iban && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-10 flex-shrink-0">IBAN</span>
                  <span className="text-gray-700 font-mono font-medium">{formatIBAN(bankData.iban)}</span>
                </div>
              )}
              {bankData.bic && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-10 flex-shrink-0">BIC</span>
                  <span className="text-gray-700 font-mono font-medium">{bankData.bic}</span>
                </div>
              )}
              {bankData.bankName && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-10 flex-shrink-0">Bank</span>
                  <span className="text-gray-700 font-medium">{bankData.bankName}</span>
                </div>
              )}
              {(bankData.accountHolder || user?.businessName) && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-10 flex-shrink-0">Name</span>
                  <span className="text-gray-700 font-medium">{bankData.accountHolder || user?.businessName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Fallback: legacy plain-text bank details */}
      {user?.bankDetails && !bankData && (
        <div className="px-6 pb-4">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
            <p className="text-[10px] font-semibold text-gray-600 mb-0.5">
              Payment Information
            </p>
            <p className="text-gray-700 text-xs whitespace-pre-line leading-relaxed">
              {user.bankDetails}
            </p>
          </div>
        </div>
      )}

      {/* Payment Notes */}
      {paymentNotes && (
        <div className="px-6 pb-4">
          <div className="bg-amber-50 rounded-lg border border-amber-200/80 p-3">
            <p className="text-[10px] font-semibold text-amber-900 mb-0.5">
              Payment Notes
            </p>
            <p className="text-amber-800 text-xs whitespace-pre-line leading-relaxed">
              {paymentNotes}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/30">
        {(user?.kvkNumber || user?.vatNumber) && (
          <p className="text-[10px] text-gray-400 text-center mb-1">
            {formatComplianceFooter(countryConfig, user?.kvkNumber || null, user?.vatNumber || null)}
          </p>
        )}
        {invoiceCountry === "BE" && invoiceType === "credit_note" && referenceInvoice && (
          <p className="text-[10px] text-amber-600 text-center mb-1">
            {countryConfig.creditNoteText}
          </p>
        )}
        <p className="text-[10px] text-gray-400 text-center">
          Generated with TradeInvoice
        </p>
      </div>
    </div>
  );
}

// ─── Main Form ──────────────────────────────────────────────────────────────
function NewInvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get("clientId") || "";
  const preselectedType = searchParams.get("type") || "invoice";

  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState(preselectedClientId);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [description, setDescription] = useState("");
  const [paymentTerms, setPaymentTerms] = useState(30); // days, -1 = custom
  const [dueDate, setDueDate] = useState(() => calculateDueDate(30));
  const [serviceDate, setServiceDate] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [notesToClient, setNotesToClient] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [currency, setCurrency] = useState("EUR");
  const [invoiceType, setInvoiceType] = useState(
    preselectedType === "quote"
      ? "quote"
      : preselectedType === "credit_note"
      ? "credit_note"
      : "invoice"
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState("monthly");
  const [reverseCharge, setReverseCharge] = useState(false);
  const [referenceInvoice, setReferenceInvoice] = useState("");
  const [invoiceCountry, setInvoiceCountry] = useState("NL");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // New client inline form
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientAddress, setNewClientAddress] = useState("");
  const [newClientVatNumber, setNewClientVatNumber] = useState("");

  // User business details
  const [user, setUser] = useState<UserProfile | null>(null);

  // Invoice theme
  const [invoiceTheme, setInvoiceTheme] = useState("classic");

  // Pro upgrade modal
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("");
  const isPro = user?.plan === "pro";

  function showProPrompt(feature: string) {
    setUpgradeFeature(feature);
    setShowUpgradeModal(true);
  }

  // Mobile preview toggle
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Common items suggestions
  const [showSuggestions, setShowSuggestions] = useState<number | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const selectedClient = clients.find((c) => c.id === clientId);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => {
        setClients(data);
        if (preselectedClientId) {
          setClientId(preselectedClientId);
        }
      })
      .catch(() => {});

    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => setUser(data))
      .catch(() => {});

    fetch("/api/invoices/next-number")
      .then((r) => r.json())
      .then((data) => setInvoiceNumber(data.nextNumber))
      .catch(() => {});
  }, [preselectedClientId]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function addLineItem() {
    setLineItems([
      ...lineItems,
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
  }

  function removeLineItem(index: number) {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  function updateLineItem(
    index: number,
    field: keyof LineItem,
    value: string | number
  ) {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  }

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  async function handleNewClient() {
    if (!newClientName || !newClientEmail) return;
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newClientName,
        email: newClientEmail,
        phone: newClientPhone || null,
        address: newClientAddress || null,
        vatNumber: newClientVatNumber || null,
      }),
    });
    if (res.ok) {
      const client = await res.json();
      setClients([...clients, client]);
      setClientId(client.id);
      setShowNewClient(false);
      setNewClientName("");
      setNewClientEmail("");
      setNewClientPhone("");
      setNewClientAddress("");
      setNewClientVatNumber("");
    }
  }

  async function handleSubmit(sendNow: boolean) {
    setError("");
    const errors: Record<string, string> = {};
    if (!clientId) errors.clientId = "Select a client to bill";
    if (!invoiceNumber.trim())
      errors.invoiceNumber = "Invoice number is required";
    if (lineItems.length === 0 || !lineItems[0].description)
      errors.lineItems = "Add at least one item";
    if (!dueDate) errors.dueDate = "Set a due date";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          description,
          dueDate,
          taxRate,
          serviceDate: serviceDate || null,
          paymentNotes: paymentNotes || null,
          notesToClient: notesToClient || null,
          invoiceNumber: invoiceNumber || null,
          currency,
          type: invoiceType,
          isRecurring,
          recurringInterval: isRecurring ? recurringInterval : null,
          reverseCharge,
          referenceInvoice:
            invoiceType === "credit_note" ? referenceInvoice || null : null,
          invoiceCountry,
          language,
          invoiceTheme: isPro ? invoiceTheme : "classic",
          lineItems: lineItems.filter(
            (item) => item.description && item.unitPrice > 0
          ),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create invoice");
      }

      const invoice = await res.json();

      if (sendNow) {
        await fetch(`/api/invoices/${invoice.id}/send`, { method: "POST" });
      }

      router.push(`/invoices/${invoice.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPreview() {
    setError("");
    const errors: Record<string, string> = {};
    if (!clientId) errors.clientId = "Select a client to bill";
    if (!invoiceNumber.trim())
      errors.invoiceNumber = "Invoice number is required";
    if (lineItems.length === 0 || !lineItems[0].description)
      errors.lineItems = "Add at least one item";
    if (!dueDate) errors.dueDate = "Set a due date";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          description,
          dueDate,
          taxRate,
          serviceDate: serviceDate || null,
          paymentNotes: paymentNotes || null,
          notesToClient: notesToClient || null,
          invoiceNumber: invoiceNumber || null,
          currency,
          type: invoiceType,
          isRecurring,
          recurringInterval: isRecurring ? recurringInterval : null,
          reverseCharge,
          referenceInvoice:
            invoiceType === "credit_note" ? referenceInvoice || null : null,
          invoiceCountry,
          language,
          invoiceTheme: isPro ? invoiceTheme : "classic",
          lineItems: lineItems.filter(
            (item) => item.description && item.unitPrice > 0
          ),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create invoice");
      }

      const invoice = await res.json();
      window.open(`/api/invoices/${invoice.id}/pdf`, "_blank");
      router.push(`/invoices/${invoice.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const formatAmount = (n: number) =>
    new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(n);

  const isValid =
    clientId && lineItems.some((i) => i.description && i.unitPrice > 0);

  // Validation warning banner
  const missingFields: string[] = [];
  if (!clientId) missingFields.push("Client");
  if (!lineItems.some((i) => i.description && i.unitPrice > 0)) missingFields.push("Line items");
  if (!dueDate) missingFields.push("Due date");
  if (invoiceCountry === "DE" && !serviceDate) missingFields.push("Service date (required for DE)");

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Mobile floating preview toggle */}
      <button
        onClick={() => setShowMobilePreview(!showMobilePreview)}
        style={{ position: 'fixed', bottom: '7rem', right: '1rem', zIndex: 9999 }}
        className="bg-gradient-to-r from-amber-500 to-amber-400 text-gray-950 rounded-full px-5 py-3 text-base font-bold shadow-lg shadow-amber-500/30 active:scale-95 transition-transform mobile-preview-btn"
      >
        {showMobilePreview ? "Edit" : "Preview"}
      </button>

      <div className="max-w-[1440px] mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* ── LEFT: Form (40%) ─────────────────────────────────────── */}
          <div
            className={
              showMobilePreview
                ? "hidden md:block w-full md:w-[45%] md:flex-shrink-0"
                : "w-full md:w-[45%] md:flex-shrink-0"
            }
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Create{" "}
                {invoiceType === "quote"
                  ? "Quote"
                  : invoiceType === "credit_note"
                  ? "Credit Note"
                  : "Invoice"}
              </h1>
              {invoiceNumber && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">
                    #{" "}
                  </label>
                  <input
                    value={invoiceNumber}
                    onChange={(e) => {
                      setInvoiceNumber(e.target.value);
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.invoiceNumber;
                        return next;
                      });
                    }}
                    className={`w-32 px-3 py-1.5 rounded-lg border text-sm font-mono focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white text-center ${
                      fieldErrors.invoiceNumber
                        ? "border-red-500"
                        : "border-gray-800/50"
                    }`}
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
                {error}
              </div>
            )}

            {/* Missing fields warning */}
            {missingFields.length > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/20 text-amber-400 p-3 rounded-xl mb-5 text-sm flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Required: {missingFields.join(", ")}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* Country & Type & Currency */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50">
                {/* Country Selector - Prominent with flag */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Invoice Country
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.values(COUNTRY_CONFIGS).map((c) => (
                      <button
                        key={c.countryCode}
                        type="button"
                        onClick={() => {
                          setInvoiceCountry(c.countryCode);
                          setCurrency(c.defaultCurrency);
                          setTaxRate(c.vatRates[0].rate);
                        }}
                        className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-center transition-all ${
                          invoiceCountry === c.countryCode
                            ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30"
                            : "border-gray-700/50 hover:border-gray-600/50 bg-gray-900/50"
                        }`}
                      >
                        <span className="text-2xl leading-none">{c.flag}</span>
                        <span className={`text-xs font-bold ${invoiceCountry === c.countryCode ? "text-amber-400" : "text-white"}`}>
                          {c.countryCode}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Type
                    </label>
                    <select
                      value={invoiceType}
                      onChange={(e) => setInvoiceType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white"
                    >
                      <option value="invoice">Invoice</option>
                      <option value="quote">Quote / Estimate</option>
                      <option value="credit_note">Credit Note</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white"
                    >
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="RON">RON - Romanian Leu</option>
                      <option value="PLN">PLN - Polish Zloty</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      PDF Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white"
                    >
                      <option value="en">English</option>
                      <option value="nl">Dutch (Nederlands)</option>
                      <option value="de">German (Deutsch)</option>
                    </select>
                  </div>
                  {invoiceType === "credit_note" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Reference Invoice #
                      </label>
                      <input
                        placeholder="e.g. INV-0001"
                        value={referenceInvoice}
                        onChange={(e) => setReferenceInvoice(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white placeholder-gray-500"
                      />
                    </div>
                  )}
                </div>

                {/* Recurring Toggle (Pro) */}
                {invoiceType === "invoice" && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-sm font-medium text-white flex items-center gap-2">
                            Make Recurring
                            {!isPro && <ProBadge onClick={() => showProPrompt("Recurring invoices")} />}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Auto-create invoices on a schedule
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!isPro) { showProPrompt("Recurring invoices"); return; }
                          setIsRecurring(!isRecurring);
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isRecurring && isPro ? "bg-amber-500" : "bg-gray-600"
                        } ${!isPro ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isRecurring && isPro ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    {isRecurring && isPro && (
                      <div className="mt-2">
                        <select
                          value={recurringInterval}
                          onChange={(e) => setRecurringInterval(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* Reverse Charge Toggle */}
                {invoiceType !== "quote" && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">
                          VAT Reverse Charge
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          B2B services to EU clients outside your country
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !reverseCharge;
                          setReverseCharge(next);
                          if (next) setTaxRate(0);
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          reverseCharge ? "bg-amber-500" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            reverseCharge ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    {reverseCharge && (
                      <p className="mt-1.5 text-xs text-amber-400">
                        Tax rate set to 0%. &quot;{getCountryConfig(invoiceCountry).reverseChargeText}&quot; will appear on the invoice.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Client */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50">
                <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                  Client <span className="text-red-500">*</span>
                </h2>
                {!showNewClient ? (
                  <div className="space-y-3">
                    <select
                      value={clientId}
                      onChange={(e) => {
                        setClientId(e.target.value);
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.clientId;
                          return next;
                        });
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white ${
                        fieldErrors.clientId
                          ? "border-red-500"
                          : "border-gray-800/50"
                      }`}
                    >
                      <option value="">Select a client...</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.email})
                        </option>
                      ))}
                    </select>
                    {fieldErrors.clientId && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.clientId}
                      </p>
                    )}

                    {selectedClient && (
                      <div className="bg-gray-900/60 rounded-xl p-3 border border-gray-700/50">
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          <div>
                            <span className="text-gray-500">Name:</span>{" "}
                            <span className="text-gray-300">
                              {selectedClient.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Email:</span>{" "}
                            <span className="text-gray-300">
                              {selectedClient.email}
                            </span>
                          </div>
                          {selectedClient.phone && (
                            <div>
                              <span className="text-gray-500">Phone:</span>{" "}
                              <span className="text-gray-300">
                                {selectedClient.phone}
                              </span>
                            </div>
                          )}
                          {selectedClient.address && (
                            <div>
                              <span className="text-gray-500">Address:</span>{" "}
                              <span className="text-gray-300">
                                {selectedClient.address}
                              </span>
                            </div>
                          )}
                        </div>
                        {!selectedClient.address && (
                          <div className="mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-xs text-yellow-400">
                            Client address recommended for legal compliance. Add it
                            in Clients page.
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowNewClient(true)}
                      className="text-amber-500 font-medium text-sm hover:underline"
                    >
                      + Add new client
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Client name *"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white placeholder-gray-500"
                      />
                      <input
                        placeholder="Client email *"
                        type="email"
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white placeholder-gray-500"
                      />
                      <input
                        placeholder="Phone (optional)"
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white placeholder-gray-500"
                      />
                      <input
                        placeholder="Address (required for legal)"
                        value={newClientAddress}
                        onChange={(e) => setNewClientAddress(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white placeholder-gray-500"
                      />
                      <input
                        placeholder="VAT number (optional)"
                        value={newClientVatNumber}
                        onChange={(e) => setNewClientVatNumber(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white placeholder-gray-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleNewClient}
                        className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        Save Client
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewClient(false)}
                        className="text-gray-400 px-4 py-2 text-sm hover:text-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Job Details */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50">
                <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  Job Details
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  Describe the work and set dates
                </p>
                <input
                  placeholder="e.g. Bathroom renovation, boiler repair, electrical work..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white placeholder-gray-500 mb-3"
                />

                {/* Payment Terms + Due Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Payment Terms
                    </label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => {
                        const days = Number(e.target.value);
                        setPaymentTerms(days);
                        if (days >= 0) {
                          setDueDate(calculateDueDate(days));
                          setFieldErrors((prev) => {
                            const next = { ...prev };
                            delete next.dueDate;
                            return next;
                          });
                        }
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white"
                      style={{ minHeight: "44px" }}
                    >
                      {PAYMENT_TERMS.map((pt) => (
                        <option key={pt.days} value={pt.days}>{pt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => {
                        setDueDate(e.target.value);
                        setPaymentTerms(-1);
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.dueDate;
                          return next;
                        });
                      }}
                      disabled={paymentTerms !== -1}
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-gray-900 text-white appearance-none [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:invert ${
                        fieldErrors.dueDate
                          ? "border-red-500"
                          : "border-gray-800/50"
                      } ${paymentTerms !== -1 ? "opacity-60" : ""}`}
                      style={{ minHeight: "44px" }}
                    />
                    {fieldErrors.dueDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldErrors.dueDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      {getCountryConfig(invoiceCountry).serviceDateLabel}
                      {invoiceCountry === "DE" && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                      type="date"
                      value={serviceDate}
                      onChange={(e) => setServiceDate(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white appearance-none [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:invert ${
                        invoiceCountry === "DE" && !serviceDate ? "border-amber-500/50" : "border-gray-800/50"
                      }`}
                      style={{ minHeight: "44px" }}
                    />
                    {invoiceCountry === "DE" && !serviceDate && (
                      <p className="text-xs text-amber-400 mt-1">
                        Required for German invoices (Leistungsdatum)
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      VAT Rate
                    </label>
                    <select
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      disabled={reverseCharge}
                      className={`w-full px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white ${
                        reverseCharge ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={{ minHeight: "44px" }}
                    >
                      {getCountryConfig(invoiceCountry).vatRates.map((vr) => (
                        <option key={vr.rate} value={vr.rate}>
                          {vr.name}
                        </option>
                      ))}
                    </select>
                    {reverseCharge && (
                      <p className="text-xs text-amber-400 mt-1">
                        Disabled (reverse charge)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Notes */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50">
                <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
                  Payment Notes
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  Additional payment instructions shown on the invoice
                </p>
                <textarea
                  placeholder="e.g. Please include invoice number as payment reference"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white placeholder-gray-500 resize-none"
                />
              </div>

              {/* Notes to Client */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50">
                <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                  Notes to Client
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  Optional message displayed on the invoice
                </p>
                <textarea
                  placeholder="e.g. Thank you for your business! Work completed as agreed."
                  value={notesToClient}
                  onChange={(e) => setNotesToClient(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white placeholder-gray-500 resize-none"
                />
              </div>

              {/* Invoice Theme (Pro) */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50">
                <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" /></svg>
                  Invoice Theme
                  {!isPro && <ProBadge onClick={() => showProPrompt("Invoice themes")} />}
                </h2>
                <p className="text-xs text-gray-500 mb-3">Choose a visual style for your PDF invoice</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "classic", label: "Classic", desc: "Traditional blue", color: "bg-blue-600" },
                    { id: "modern", label: "Modern", desc: "Bold accent", color: "bg-indigo-500" },
                    { id: "minimal", label: "Minimal", desc: "Clean & sparse", color: "bg-gray-500" },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        if (!isPro && theme.id !== "classic") {
                          showProPrompt("Invoice themes");
                          return;
                        }
                        setInvoiceTheme(theme.id);
                      }}
                      className={`relative p-3 rounded-xl border text-left transition-all ${
                        invoiceTheme === theme.id
                          ? "border-amber-500 bg-amber-500/5"
                          : "border-gray-700/50 hover:border-gray-600/50"
                      } ${!isPro && theme.id !== "classic" ? "opacity-60" : ""}`}
                    >
                      <div className={`w-full h-2 rounded-full ${theme.color} mb-2`} />
                      <p className="text-sm font-medium text-white">{theme.label}</p>
                      <p className="text-xs text-gray-500">{theme.desc}</p>
                      {!isPro && theme.id !== "classic" && (
                        <span className="absolute top-2 right-2 text-xs">🔒</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Items */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50">
                <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                  Line Items <span className="text-red-500">*</span>
                </h2>
                {fieldErrors.lineItems && (
                  <p className="text-red-500 text-sm mb-3">
                    {fieldErrors.lineItems}
                  </p>
                )}
                <div className="space-y-3" ref={suggestionsRef}>
                  {lineItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-950/40 sm:bg-transparent rounded-xl p-3 sm:p-0 border border-gray-800/50 sm:border-0 space-y-2 sm:space-y-0 sm:flex sm:gap-2 sm:items-start"
                    >
                      <div className="relative w-full sm:flex-1">
                        <input
                          placeholder="e.g. Bathroom renovation - labour"
                          value={item.description}
                          onChange={(e) =>
                            updateLineItem(index, "description", e.target.value)
                          }
                          onFocus={() => setShowSuggestions(index)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white placeholder-gray-500"
                        />
                        {/* Common items suggestions */}
                        {showSuggestions === index && !item.description && (
                          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                            <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Common items</p>
                            {COMMON_ITEMS.map((ci) => (
                              <button
                                key={ci.label}
                                type="button"
                                onClick={() => {
                                  updateLineItem(index, "description", ci.desc);
                                  setShowSuggestions(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                              >
                                {ci.desc}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 items-start">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) =>
                            updateLineItem(
                              index,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          className="w-16 shrink-0 px-2 py-2.5 rounded-xl border border-gray-800/50 text-sm text-center focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white"
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Price"
                          value={item.unitPrice || ""}
                          onChange={(e) =>
                            updateLineItem(
                              index,
                              "unitPrice",
                              Number(e.target.value)
                            )
                          }
                          className="min-w-0 flex-1 sm:w-24 sm:flex-none px-2 py-2.5 rounded-xl border border-gray-800/50 text-sm text-right focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all outline-none bg-gray-900/80 text-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeLineItem(index)}
                          className="p-2.5 shrink-0 text-red-400 hover:text-red-300 transition-colors"
                          title="Remove"
                          aria-label="Remove line item"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="mt-3 text-amber-500 font-medium text-sm hover:underline"
                >
                  + Add Line Item
                </button>
              </div>

              {/* Totals */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/30 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50">
                <div className="space-y-1.5 text-right">
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Subtotal</span>
                    <span>{formatAmount(subtotal)}</span>
                  </div>
                  {taxRate > 0 && (
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>Tax ({taxRate}%)</span>
                      <span>{formatAmount(tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-700">
                    <span>Total</span>
                    <span className="text-2xl">{formatAmount(total)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pb-6">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={loading || !isValid}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-gray-950 py-3.5 rounded-xl font-semibold text-base shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  {loading
                    ? "Saving..."
                    : `Save ${
                        invoiceType === "quote"
                          ? "Quote"
                          : invoiceType === "credit_note"
                          ? "Credit Note"
                          : "Invoice"
                      } as Draft`}
                </button>
                <p className="text-center text-xs text-gray-500">
                  Save now and finish later. You can send it when you&apos;re
                  ready
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={loading || !isValid}
                    className="flex-1 bg-gray-900/50 text-gray-300 py-3 rounded-xl font-medium text-sm hover:bg-gray-800/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-800/50 hover:border-gray-700/50"
                  >
                    {loading ? "Creating..." : "Create & Send"}
                  </button>
                  <button
                    onClick={handleDownloadPreview}
                    disabled={loading || !isValid}
                    className="flex-1 bg-gray-900/50 text-gray-300 py-3 rounded-xl font-medium text-sm hover:bg-gray-800/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-800/50 hover:border-gray-700/50 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Live Preview (60%) ─────────────────────────────── */}
          <div
            className={
              !showMobilePreview
                ? "hidden md:block w-full md:w-[55%]"
                : "w-full md:w-[55%]"
            }
          >
            <div className="md:sticky md:top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Live Preview
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_2px_rgba(16,185,129,0.4)]" />
                  Updates as you type
                </div>
              </div>

              <div className="max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl pb-24 md:pb-0">
                <InvoicePreview
                  invoiceNumber={invoiceNumber}
                  invoiceType={invoiceType}
                  description={description}
                  currency={currency}
                  dueDate={dueDate}
                  serviceDate={serviceDate}
                  taxRate={taxRate}
                  reverseCharge={reverseCharge}
                  paymentNotes={paymentNotes}
                  notesToClient={notesToClient}
                  lineItems={lineItems}
                  selectedClient={selectedClient}
                  referenceInvoice={referenceInvoice}
                  user={user}
                  invoiceCountry={invoiceCountry}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
      {showUpgradeModal && (
        <UpgradeModal feature={upgradeFeature} onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  );
}

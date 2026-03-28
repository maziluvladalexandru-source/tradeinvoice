export interface VatRate {
  name: string;
  rate: number;
}

export interface CountryConfig {
  countryCode: string;
  countryName: string;
  flag: string;
  businessRegLabel: string;
  taxIdLabel: string;
  taxIdFormat: RegExp;
  vatRates: VatRate[];
  defaultCurrency: string;
  defaultLanguage: string;
  reverseChargeText: string;
  complianceFooter: string; // template with {kvk}, {btw}, etc.
  retentionYears: number;
  serviceDateRequired: boolean;
  serviceDateLabel: string;
  serviceDateNote: string; // Germany: note when service date = invoice date
  creditNoteText: string; // Belgium: specific credit note reference text
}

export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  NL: {
    countryCode: "NL",
    countryName: "Netherlands",
    flag: "🇳🇱",
    businessRegLabel: "KVK",
    taxIdLabel: "BTW-id",
    taxIdFormat: /^NL\d{9}B\d{2}$/,
    vatRates: [
      { name: "Standard (21%)", rate: 21 },
      { name: "Reduced (9%)", rate: 9 },
      { name: "Zero (0%)", rate: 0 },
    ],
    defaultCurrency: "EUR",
    defaultLanguage: "nl",
    reverseChargeText: "BTW verlegd",
    complianceFooter: "KVK: {kvk} | BTW-id: {btw}",
    retentionYears: 7,
    serviceDateRequired: true,
    serviceDateLabel: "Service Date",
    serviceDateNote: "",
    creditNoteText: "",
  },
  UK: {
    countryCode: "UK",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    businessRegLabel: "Companies House #",
    taxIdLabel: "VAT Number",
    taxIdFormat: /^GB\d{9}$/,
    vatRates: [
      { name: "Standard (20%)", rate: 20 },
      { name: "Reduced (5%)", rate: 5 },
      { name: "Zero (0%)", rate: 0 },
    ],
    defaultCurrency: "GBP",
    defaultLanguage: "en",
    reverseChargeText:
      "Reverse charge: Customer to account for VAT to HMRC",
    complianceFooter: "VAT Reg: {btw} | Companies House: {kvk}",
    retentionYears: 6,
    serviceDateRequired: true,
    serviceDateLabel: "Tax Point",
    serviceDateNote: "",
    creditNoteText: "",
  },
  DE: {
    countryCode: "DE",
    countryName: "Germany",
    flag: "🇩🇪",
    businessRegLabel: "Handelsregister",
    taxIdLabel: "Steuernummer/USt-IdNr",
    taxIdFormat: /^DE\d{9}$/,
    vatRates: [
      { name: "Standard (19%)", rate: 19 },
      { name: "Reduced (7%)", rate: 7 },
    ],
    defaultCurrency: "EUR",
    defaultLanguage: "de",
    reverseChargeText:
      "Steuerschuldnerschaft des Leistungsempf\u00e4ngers",
    complianceFooter:
      "Steuernummer: {btw} | Handelsregister: {kvk}",
    retentionYears: 10,
    serviceDateRequired: true,
    serviceDateLabel: "Leistungsdatum",
    serviceDateNote: "Leistungsdatum entspricht Rechnungsdatum",
    creditNoteText: "",
  },
  BE: {
    countryCode: "BE",
    countryName: "Belgium",
    flag: "🇧🇪",
    businessRegLabel: "Ondernemingsnummer",
    taxIdLabel: "BTW-nummer",
    taxIdFormat: /^BE\d{10}$/,
    vatRates: [
      { name: "Standard (21%)", rate: 21 },
      { name: "Reduced (12%)", rate: 12 },
      { name: "Reduced (6%)", rate: 6 },
      { name: "Zero (0%)", rate: 0 },
    ],
    defaultCurrency: "EUR",
    defaultLanguage: "en",
    reverseChargeText:
      "BTW verlegd / TVA due par le cocontractant",
    complianceFooter: "Ondernemingsnummer: {kvk} | BTW: {btw}",
    retentionYears: 7,
    serviceDateRequired: true,
    serviceDateLabel: "Service Date",
    serviceDateNote: "",
    creditNoteText:
      "Any deducted VAT to be refunded to the state",
  },
};

export const COUNTRY_LIST = Object.values(COUNTRY_CONFIGS);

export function getCountryConfig(code: string): CountryConfig {
  return COUNTRY_CONFIGS[code] || COUNTRY_CONFIGS.NL;
}

export function formatComplianceFooter(
  config: CountryConfig,
  kvk: string | null,
  btw: string | null
): string {
  if (!kvk && !btw) return "";
  let footer = config.complianceFooter;
  footer = footer.replace("{kvk}", kvk || "—");
  footer = footer.replace("{btw}", btw || "—");
  // Remove sections with "—" to keep it clean
  if (!kvk) {
    footer = footer
      .replace(/[^|]*:\s*—\s*\|?\s*/, "")
      .replace(/\|\s*$/, "")
      .trim();
  }
  if (!btw) {
    footer = footer
      .replace(/\|?\s*[^|]*:\s*—/, "")
      .replace(/^\s*\|/, "")
      .trim();
  }
  return footer;
}

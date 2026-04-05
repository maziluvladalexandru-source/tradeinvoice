const fs = require('fs');

console.log('🔧 Adding ALL missing translation keys...\n');

// EN
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf-8'));

// Add missing sections
en.onboarding = {
  title: 'Get Started',
  stepsDone: '{count} steps completed',
  step1: 'Add your business details',
  step1Desc: 'Your name, address, and bank details appear on invoices',
  step2: 'Create your first invoice',
  step2Desc: 'Send professional invoices in under a minute',
  step3: 'Share your invoice link with a client',
  step3Desc: 'Email an invoice directly to your client',
};

en.services = {
  title: 'Service Library',
  subtitle: 'Save commonly used items to quickly add them to invoices',
  addItem: 'Add Item',
  noItems: 'No saved items yet',
  noItemsDesc: 'Add your commonly used services and materials to speed up invoice creation.',
  addFirstItem: 'Add your first item',
  saving: 'Saving...',
  save: 'Save',
  cancel: 'Cancel',
  update: 'Update',
};

en.expenses = {
  ...en.expenses,
  addFirstExpense: 'Add Your First Expense',
};

en.settings = {
  ...en.settings,
  account: 'Account',
  accountMenu: 'ACCOUNT',
  subscription: 'Subscription',
  businessInformation: 'Business Information',
  invoicing: 'INVOICING',
  invoiceDefaults: 'Invoice Defaults',
  taxRegistration: 'Tax & Registration',
  paymentDetails: 'Payment Details',
  latePaymentFees: 'Late Payment Fees',
  communication: 'COMMUNICATION',
  emailTemplates: 'Email Templates',
  paymentReminders: 'Payment Reminders',
  notifications: 'Notifications',
  securityData: 'SECURITY & DATA',
  security: 'Security',
  teamMembers: 'Team Members',
  dataExport: 'Data Export',
  invoiceLogo: 'Invoice Logo',
  yourName: 'Your Name',
  yourFullName: 'Your full name',
  businessName: 'Business Name',
  yourBusinessName: 'Your business name',
  businessAddress: 'Business Address',
  businessPhone: 'Business Phone',
  countryCode: 'Include country code, e.g. +31 6 12345678 (NL) or +40 712 345 678 (RO)',
  unlimitedInvoices: 'Unlimited invoices per month',
  active: 'Active',
  proplan: 'Pro Plan',
};

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
console.log('✅ Updated EN');

// NL
const nl = JSON.parse(fs.readFileSync('messages/nl.json', 'utf-8'));

nl.onboarding = {
  title: 'Aan de slag',
  stepsDone: '{count} stappen voltooid',
  step1: 'Voeg uw bedrijfsgegevens toe',
  step1Desc: 'Uw naam, adres en bankgegevens verschijnen op facturen',
  step2: 'Maak uw eerste factuur',
  step2Desc: 'Stuur professionele facturen in minder dan een minuut',
  step3: 'Deel uw factuurl ink met een klant',
  step3Desc: 'E-mail een factuur direct naar uw klant',
};

nl.services = {
  title: 'Servicebibliotheek',
  subtitle: 'Sla veelgebruikte items op voor snelle toevoeging aan facturen',
  addItem: 'Item toevoegen',
  noItems: 'Nog geen items opgeslagen',
  noItemsDesc: 'Voeg uw veelgebruikte diensten en materialen toe om factuuraanmaak sneller te maken.',
  addFirstItem: 'Voeg uw eerste item toe',
  saving: 'Bezig met opslaan...',
  save: 'Opslaan',
  cancel: 'Annuleren',
  update: 'Bijwerken',
};

nl.expenses = {
  ...nl.expenses,
  addFirstExpense: 'Voeg uw eerste uitgave toe',
};

nl.settings = {
  ...nl.settings,
  account: 'Account',
  accountMenu: 'ACCOUNT',
  subscription: 'Abonnement',
  businessInformation: 'Bedrijfsgegevens',
  invoicing: 'FACTURERING',
  invoiceDefaults: 'Factuurstandaarden',
  taxRegistration: 'Belasting & Registratie',
  paymentDetails: 'Betalingsgegevens',
  latePaymentFees: 'Late Betalingskosten',
  communication: 'COMMUNICATIE',
  emailTemplates: 'E-mailsjablonen',
  paymentReminders: 'Betalingsherinneringen',
  notifications: 'Meldingen',
  securityData: 'BEVEILIGING & GEGEVENS',
  security: 'Beveiliging',
  teamMembers: 'Teamleden',
  dataExport: 'Gegevensexport',
  invoiceLogo: 'Factuurlogo',
  yourName: 'Uw naam',
  yourFullName: 'Uw volledige naam',
  businessName: 'Bedrijfsnaam',
  yourBusinessName: 'Uw bedrijfsnaam',
  businessAddress: 'Bedrijfsadres',
  businessPhone: 'Bedrijfstelefo on',
  countryCode: 'Inclusief landcode, b.v. +31 6 12345678 (NL) of +40 712 345 678 (RO)',
  unlimitedInvoices: 'Onbeperkte facturen per maand',
  active: 'Actief',
  proplan: 'Pro Plan',
};

fs.writeFileSync('messages/nl.json', JSON.stringify(nl, null, 2));
console.log('✅ Updated NL');

// DE
const de = JSON.parse(fs.readFileSync('messages/de.json', 'utf-8'));

de.onboarding = {
  title: 'Erste Schritte',
  stepsDone: '{count} Schritte abgeschlossen',
  step1: 'Fügen Sie Ihre Geschäftsdaten hinzu',
  step1Desc: 'Ihr Name, Adresse und Bankdaten erscheinen auf Rechnungen',
  step2: 'Erstellen Sie Ihre erste Rechnung',
  step2Desc: 'Senden Sie professionelle Rechnungen in weniger als einer Minute',
  step3: 'Teilen Sie Ihren Rechnungslink mit einem Kunden',
  step3Desc: 'E-Mail eine Rechnung direkt an Ihren Kunden',
};

de.services = {
  title: 'Dienstbibliothek',
  subtitle: 'Speichern Sie häufig verwendete Artikel für schnelle Rechnungserstellung',
  addItem: 'Artikel hinzufügen',
  noItems: 'Noch keine Artikel gespeichert',
  noItemsDesc: 'Fügen Sie Ihre häufig verwendeten Dienstleistungen und Materialien hinzu, um die Rechnungserstellung zu beschleunigen.',
  addFirstItem: 'Fügen Sie Ihren ersten Artikel hinzu',
  saving: 'Wird gespeichert...',
  save: 'Speichern',
  cancel: 'Abbrechen',
  update: 'Aktualisieren',
};

de.expenses = {
  ...de.expenses,
  addFirstExpense: 'Fügen Sie Ihre erste Ausgabe hinzu',
};

de.settings = {
  ...de.settings,
  account: 'Konto',
  accountMenu: 'KONTO',
  subscription: 'Abonnement',
  businessInformation: 'Geschäftsinformationen',
  invoicing: 'RECHNUNGSSTELLUNG',
  invoiceDefaults: 'Rechnungsstandardwerte',
  taxRegistration: 'Steuern & Registrierung',
  paymentDetails: 'Zahlungsdetails',
  latePaymentFees: 'Verspätete Zahlungsgebühren',
  communication: 'KOMMUNIKATION',
  emailTemplates: 'E-Mail-Vorlagen',
  paymentReminders: 'Zahlungserinnerungen',
  notifications: 'Benachrichtigungen',
  securityData: 'SICHERHEIT & DATEN',
  security: 'Sicherheit',
  teamMembers: 'Teamitglieder',
  dataExport: 'Datenexport',
  invoiceLogo: 'Rechnungslogo',
  yourName: 'Ihr Name',
  yourFullName: 'Ihr vollständiger Name',
  businessName: 'Geschäftsname',
  yourBusinessName: 'Ihr Geschäftsname',
  businessAddress: 'Geschäftsadresse',
  businessPhone: 'Geschäftstelefon',
  countryCode: 'Mit Ländercode, z.B. +31 6 12345678 (NL) oder +40 712 345 678 (RO)',
  unlimitedInvoices: 'Unbegrenzte Rechnungen pro Monat',
  active: 'Aktiv',
  proplan: 'Pro Plan',
};

fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2));
console.log('✅ Updated DE');

console.log('\n✅ All translations added! Now fix the components.');

const fs = require('fs');

// Missing keys to add
const keysToAdd = {
  'common': {
    'save': 'Save',
    'update': 'Update',
    'saving': 'Saving...',
    'edit': 'Edit',
    'create': 'Create',
    'preview': 'Preview',
    'invoiceCreated': 'Invoice created',
  }
};

// EN
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf-8'));
en.common = { ...en.common, ...keysToAdd.common };
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));

// NL
const nl = JSON.parse(fs.readFileSync('messages/nl.json', 'utf-8'));
nl.common = {
  ...nl.common,
  'save': 'Opslaan',
  'update': 'Bijwerken',
  'saving': 'Bezig met opslaan...',
  'edit': 'Bewerken',
  'create': 'Maken',
  'preview': 'Voorbeeld',
  'invoiceCreated': 'Factuur gemaakt',
};
fs.writeFileSync('messages/nl.json', JSON.stringify(nl, null, 2));

// DE
const de = JSON.parse(fs.readFileSync('messages/de.json', 'utf-8'));
de.common = {
  ...de.common,
  'save': 'Speichern',
  'update': 'Aktualisieren',
  'saving': 'Wird gespeichert...',
  'edit': 'Bearbeiten',
  'create': 'Erstellen',
  'preview': 'Vorschau',
  'invoiceCreated': 'Rechnung erstellt',
};
fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2));

console.log('✅ Added missing common keys to all 3 language files');

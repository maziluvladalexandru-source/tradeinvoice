const fs = require('fs');

// Update NL
const nl = JSON.parse(fs.readFileSync('messages/nl.json', 'utf-8'));
nl.clients.deleteConfirm = 'Client "{name}" verwijderen? Dit kan niet ongedaan gemaakt worden.';
nl.expenses.deleteExpenseConfirm = 'Deze uitgave verwijderen?';
nl.expenses.deleteMileageConfirm = 'Dit kilometeraantal verwijderen?';
nl.invoices.deleteConfirm = 'Weet u zeker dat u factuur {number} wilt verwijderen?';
nl.invoices.saving = 'Bezig met opslaan...';
nl.invoices.confirmPayment = 'Betaling bevestigen';
fs.writeFileSync('messages/nl.json', JSON.stringify(nl, null, 2));

// Update DE
const de = JSON.parse(fs.readFileSync('messages/de.json', 'utf-8'));
de.clients.deleteConfirm = 'Kunde "{name}" löschen? Dies kann nicht rückgängig gemacht werden.';
de.expenses.deleteExpenseConfirm = 'Diese Ausgabe löschen?';
de.expenses.deleteMileageConfirm = 'Diesen Kilometerstand löschen?';
de.invoices.deleteConfirm = 'Sind Sie sicher, dass Sie Rechnung {number} löschen möchten?';
de.invoices.saving = 'Wird gespeichert...';
de.invoices.confirmPayment = 'Zahlung bestätigen';
fs.writeFileSync('messages/de.json', JSON.stringify(de, null, 2));

console.log('✅ Updated NL and DE with new confirmation dialog keys');

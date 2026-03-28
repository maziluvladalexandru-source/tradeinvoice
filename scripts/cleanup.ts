import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting cleanup...\n");

  // 1. Delete duplicate client 'Iordachescu Andra' (0 invoices)
  const dupeClient = await prisma.client.findUnique({
    where: { id: "dd32f5f0-04c4-4b89-a7c2-59fe539eba67" },
    include: { _count: { select: { invoices: true } } },
  });
  if (dupeClient) {
    console.log(`Found duplicate client: ${dupeClient.name} (${dupeClient.id}), invoices: ${dupeClient._count.invoices}`);
    if (dupeClient._count.invoices === 0) {
      await prisma.client.delete({ where: { id: dupeClient.id } });
      console.log("  -> Deleted.\n");
    } else {
      console.log("  -> Skipped (has invoices).\n");
    }
  } else {
    console.log("Duplicate client dd32f5f0... not found (already deleted?).\n");
  }

  // 2. Delete test client 'Jan de Boer Plumbing' and its invoices
  const testClient = await prisma.client.findUnique({
    where: { id: "055921df-942d-4c11-ab23-840b3ff75f38" },
    include: { invoices: { select: { id: true, invoiceNumber: true } } },
  });
  if (testClient) {
    console.log(`Found test client: ${testClient.name} (${testClient.id}), invoices: ${testClient.invoices.length}`);
    // Delete associated invoices first (line items cascade)
    for (const inv of testClient.invoices) {
      await prisma.lineItem.deleteMany({ where: { invoiceId: inv.id } });
      await prisma.invoice.delete({ where: { id: inv.id } });
      console.log(`  -> Deleted invoice ${inv.invoiceNumber}`);
    }
    // Delete time entries, mileage entries linked to this client
    await prisma.timeEntry.deleteMany({ where: { clientId: testClient.id } });
    await prisma.mileageEntry.deleteMany({ where: { clientId: testClient.id } });
    await prisma.activeTimer.deleteMany({ where: { clientId: testClient.id } });
    await prisma.client.delete({ where: { id: testClient.id } });
    console.log("  -> Deleted client.\n");
  } else {
    console.log("Test client 055921df... not found (already deleted?).\n");
  }

  // 3. Delete test expense 'Copper pipes and fittings'
  const testExpenses = await prisma.expense.findMany({
    where: { description: "Copper pipes and fittings" },
  });
  if (testExpenses.length > 0) {
    for (const exp of testExpenses) {
      await prisma.expense.delete({ where: { id: exp.id } });
      console.log(`Deleted expense: ${exp.description} (${exp.id})`);
    }
  } else {
    console.log("Test expense 'Copper pipes and fittings' not found.\n");
  }

  // 4. Delete test time entry 'Untitled task'
  const testTimeEntries = await prisma.timeEntry.findMany({
    where: { description: "Untitled task" },
  });
  if (testTimeEntries.length > 0) {
    for (const te of testTimeEntries) {
      await prisma.timeEntry.delete({ where: { id: te.id } });
      console.log(`Deleted time entry: ${te.description} (${te.id})`);
    }
  } else {
    console.log("Test time entry 'Untitled task' not found.\n");
  }

  // 5. Delete test service 'Boiler service'
  const testServices = await prisma.serviceItem.findMany({
    where: { name: "Boiler service" },
  });
  if (testServices.length > 0) {
    for (const svc of testServices) {
      await prisma.serviceItem.delete({ where: { id: svc.id } });
      console.log(`Deleted service: ${svc.name} (${svc.id})`);
    }
  } else {
    console.log("Test service 'Boiler service' not found.\n");
  }

  console.log("\nCleanup complete!");
}

main()
  .catch((e) => {
    console.error("Cleanup failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

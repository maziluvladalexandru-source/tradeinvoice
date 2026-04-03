export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  keyword: string;
  metaDescription: string;
  content: string;
}

export const articles: Article[] = [
  {
    slug: "how-to-create-professional-invoice-zzp-netherlands",
    title: "How to Create a Professional Invoice as a ZZP'er in the Netherlands",
    excerpt: "Everything you need to know about invoicing as a Dutch freelancer - KVK number, BTW, payment terms, and legal requirements explained in plain language.",
    date: "2026-03-25",
    readTime: "6 min read",
    keyword: "invoice zzp netherlands",
    metaDescription: "Learn how to create a professional invoice as a ZZP'er in the Netherlands. Covers KVK number, BTW/VAT, payment terms, and all legal requirements for Dutch freelancers.",
    content: `
## Why Your Invoice Matters More Than You Think

As a ZZP'er (zelfstandige zonder personeel) in the Netherlands, your invoice is not just a request for payment - it is a legal document. The [Dutch tax authority (Belastingdienst)](https://www.belastingdienst.nl) has specific rules about what must appear on every invoice you send. Get it wrong, and you could face fines or lose your right to deduct BTW.

But here is the good news: once you understand the basics, creating a compliant invoice takes less than a minute. This guide walks you through everything step by step.

## The Mandatory Fields on a Dutch ZZP Invoice

The Belastingdienst requires every invoice to include the following information:

### 1. Your Business Details

- **Full legal name** (or trade name registered with KVK)
- **Address** of your business
- **KVK number** (Kamer van Koophandel registration number)
- **BTW-id** (your VAT identification number, format: NL + 9 digits + B + 2 digits)

Your KVK number is the 8-digit number you received when you registered your business at the [Chamber of Commerce (KVK)](https://www.kvk.nl). Your BTW-id is different - it is your tax identification number for VAT purposes.

### 2. Your Client's Details

- Full name or company name
- Address
- If the client is a business: their VAT number (for B2B invoices, especially cross-border)

### 3. Invoice Details

- **Invoice number**: Must be sequential and unique. You cannot skip numbers or reuse them. For example: 2026-001, 2026-002, 2026-003.
- **Invoice date**: The date you issue the invoice.
- **Description of services or goods**: Be specific. "Plumbing work" is not enough. Write "Replacement of kitchen sink tap and installation of new waste pipe at Keizersgracht 123, Amsterdam."
- **Quantity and unit price**: Break down your charges clearly.
- **BTW rate and amount**: Show the applicable rate (21% or 9%) and the calculated tax amount.
- **Total amount excluding BTW**
- **Total amount including BTW**

### 4. Payment Information

- **Your IBAN** (bank account number)
- **Payment term**: The standard in the Netherlands is 14 or 30 days. You can set your own terms, but they must be stated on the invoice.
- **BIC/SWIFT code** (optional but helpful for international clients)

## Common Mistakes ZZP'ers Make

### Forgetting the BTW-id

Many new freelancers confuse their BSN (citizen service number) with their BTW-id. Never put your BSN on an invoice. Your BTW-id starts with "NL" and is specifically for tax purposes.

### Non-Sequential Invoice Numbers

The Belastingdienst requires invoice numbers to be sequential. If you send invoice 2026-005 and then 2026-003, this raises red flags during an audit. Use software that handles numbering automatically.

### Vague Descriptions

"Services rendered in March" will not cut it. You need to describe what you actually did, when, and where. This protects both you and your client.

### Missing Payment Terms

If you do not state a payment deadline, the legal default in the Netherlands is 30 days for B2B transactions. But it is always better to state it explicitly - "Payment due within 14 days of invoice date."

## Choosing the Right Payment Terms

In the Netherlands, common payment terms are:

- **14 days**: Standard for smaller jobs and regular clients
- **30 days**: Common for larger projects and corporate clients
- **Upon completion**: Sometimes used for one-off jobs

For tradespeople like plumbers, electricians, and builders, we recommend 14 days. The shorter the payment term, the faster you get paid. You can also offer a small discount for early payment (for example, 2% discount if paid within 7 days).

## Do You Need to Charge BTW?

Most ZZP'ers charge 21% BTW on their services. However, there are exceptions:

- **KOR (Kleineondernemersregeling)**: If your annual BTW liability is under €1,800, you can opt for the small business scheme and not charge BTW. You must register for this with the Belastingdienst.
- **9% rate**: Applies to certain goods and services like home renovations (labour portion), food, and books.
- **Reverse charge (verlegd)**: For B2B services with companies in other EU countries, the VAT is "reversed" to the buyer. You write "BTW verlegd" on the invoice instead of charging BTW.

## A Practical Example

Let's say you are a plumber named Jan de Vries. You just fixed a leaking pipe at a client's home. Here is what your invoice should look like:

**From:**
Jan de Vries Loodgieterij
Prinsengracht 456, 1017 KJ Amsterdam
KVK: 12345678
BTW-id: NL123456789B01

**To:**
Maria van den Berg
Herengracht 789, 1017 BS Amsterdam

**Invoice #:** 2026-014
**Date:** 25 March 2026

| Description | Qty | Rate | Amount |
|---|---|---|---|
| Emergency pipe repair - kitchen, replace burst copper pipe (1.5m) | 1 | €120.00 | €120.00 |
| Materials: copper pipe 15mm, 2x compression fittings, PTFE tape | 1 | €34.50 | €34.50 |
| Call-out fee (evening) | 1 | €45.00 | €45.00 |

**Subtotal:** €199.50
**BTW 21%:** €41.90
**Total:** €241.40

**Payment due:** 8 April 2026 (14 days)
**IBAN:** NL91ABNA0417164300

This invoice has everything the Belastingdienst requires: your details, client details, sequential number, date, clear descriptions, BTW breakdown, and payment information.

## Tips for Getting Paid on Time

1. **Send the invoice immediately** after completing the work. The longer you wait, the longer you wait to get paid.
2. **Include your IBAN prominently** - make it easy for clients to pay.
3. **Set up automatic payment reminders** so you do not have to chase clients manually.
4. **Use professional invoice software** that handles numbering, BTW calculations, and reminders for you.

## The Bottom Line

Creating a compliant invoice in the Netherlands is not complicated once you know the rules. Make sure every invoice includes your KVK number, BTW-id, sequential invoice number, clear descriptions, and payment terms. Use software that automates the boring parts so you can focus on what you do best - your trade.

## Related Resources

- [KVK Invoice Requirements: What Every Dutch Freelancer Must Include](/blog/kvk-invoice-requirements-dutch-freelancers)
- [ZZP Invoice Template: Free Download and Complete Guide](/blog/zzp-invoice-template-free-guide)
- [BTW/VAT Rules for Self-Employed in the Netherlands (2026 Guide)](/blog/btw-vat-rules-self-employed-netherlands-2026)
- [Download a free invoice template](/templates)
`,
  },
  {
    slug: "invoice-template-plumbers-guide",
    title: "Invoice Template for Plumbers: Free Guide + Best Practices",
    excerpt: "A complete guide to creating plumbing invoices that look professional, get paid faster, and keep your books clean. Includes what to charge and how to list materials.",
    date: "2026-03-20",
    readTime: "7 min read",
    keyword: "invoice template plumber",
    metaDescription: "Free plumber invoice template and guide. Learn what to include on plumbing invoices, how to price hourly vs fixed rates, and how to mark up materials correctly.",
    content: `
## Why Plumbers Need a Proper Invoice Template

You have just spent two hours under someone's kitchen sink replacing a corroded waste pipe. Your hands are dirty, your knees hurt, and the last thing you want to think about is paperwork. But sending a professional invoice is what separates a business from a hobby - and it is what gets you paid on time.

A good invoice template saves you time, looks professional, and makes sure you never forget to charge for something. This guide shows you exactly what to include and gives you best practices specifically for plumbing businesses.

## What Every Plumbing Invoice Must Include

### Your Business Information

At the top of every invoice, include:

- Your business name (or your name if you operate as a sole trader)
- Your address
- Phone number and email
- KVK number (if you are in the Netherlands)
- BTW-id / VAT number
- Your logo (optional, but it looks professional)

### Client Information

- Client's full name or company name
- Service address (where the work was done - this might differ from their billing address)
- Phone number or email

### Job Details

This is where many plumbers fall short. Do not just write "plumbing work" and a total. Break it down:

**Labour charges:**
- Date the work was performed
- Description of the work (be specific)
- Hours worked or fixed price for the job
- Hourly rate (if billing by the hour)

**Materials:**
- List each material separately
- Include quantities
- Show the unit price

**Other charges:**
- Call-out fee (if applicable)
- Emergency/after-hours surcharge
- Travel costs (if charging separately)
- Disposal fees for old materials

### A Sample Plumbing Invoice Breakdown

Here is an example for a bathroom renovation job:

| Description | Qty | Unit Price | Total |
|---|---|---|---|
| Remove old bathtub and waste pipes | 1 job | €180.00 | €180.00 |
| Install new shower tray and drain | 1 job | €220.00 | €220.00 |
| Connect hot/cold water to new mixer tap | 1 job | €95.00 | €95.00 |
| Pressure test all new connections | 1 job | €45.00 | €45.00 |
| Grohe Eurosmart mixer tap | 1 | €149.00 | €149.00 |
| Shower drain 90mm chrome | 1 | €32.00 | €32.00 |
| PVC waste pipe 40mm (3m) | 3m | €4.50 | €13.50 |
| Copper pipe 15mm (2m) | 2m | €6.80 | €13.60 |
| Compression fittings, PTFE, silicone | 1 set | €18.50 | €18.50 |

**Subtotal:** €766.60
**BTW 21%:** €160.99
**Total:** €927.59

Notice how every line item is clear and specific. The client can see exactly what they are paying for, which reduces disputes and speeds up payment.

## Hourly Rate vs Fixed Price: Which Is Better?

This is one of the biggest decisions plumbers face when invoicing.

### Hourly Rate

**Pros:**
- You get paid for every minute you work
- Fair for jobs where the scope is uncertain (diagnostics, old buildings with surprises)
- Easy to calculate

**Cons:**
- Clients might feel anxious watching the clock
- Can lead to disputes ("it should not have taken that long")
- Punishes you for being fast and experienced

**Typical hourly rates for plumbers in the Netherlands (2026):**
- Standard hours: €45–€75 per hour (excl. BTW)
- Evening/weekend: €65–€100 per hour
- Emergency call-out: €85–€120 per hour

### Fixed Price

**Pros:**
- Clients know the cost upfront - no surprises
- Rewards efficiency (the faster you work, the higher your effective hourly rate)
- Easier to quote and compare

**Cons:**
- Risk of underquoting if the job is more complex than expected
- Need experience to price accurately

**Our recommendation:** Use fixed pricing for standard jobs (tap replacement, toilet install, radiator flush) and hourly for diagnostics, troubleshooting, and complex renovations where the scope is hard to predict. Always state which method you are using on the invoice.

## How to Mark Up Materials

Most plumbers buy materials and charge them to the client. The question is: do you mark them up?

The industry standard is a **15–25% markup** on materials. This covers:

- Your time sourcing and purchasing materials
- Transport to the job site
- Warranty handling if something is defective
- Stock holding costs

For example, if you buy a tap for €120 from your wholesaler, you might charge the client €145 (approximately 20% markup). This is completely normal and expected.

**Important tips:**
- Be transparent. If a client asks, explain that the markup covers sourcing and handling.
- For expensive items (boilers, water heaters), some plumbers charge at cost plus a separate installation fee. This can look better on the invoice.
- Always keep your purchase receipts for tax purposes.

## Professional Invoice Tips for Plumbers

### 1. Send Invoices the Same Day

The moment you finish a job, send the invoice. Every day you delay is a day you delay getting paid. With mobile invoicing apps, you can create and send an invoice from your van before you drive to the next job.

### 2. Take Photos of Completed Work

Before and after photos serve two purposes: they protect you against disputes, and they look great attached to the invoice. Some invoicing tools let you attach images directly.

### 3. Use Clear Payment Terms

State your payment deadline clearly: "Payment due within 14 days." For larger jobs, consider requiring a deposit (30–50% upfront) before starting work.

### 4. Include Your Bank Details Prominently

Make it easy for clients to pay. Put your IBAN in a clearly visible spot. If you accept card payments or iDEAL, mention those options too.

### 5. Number Your Invoices Sequentially

Use a consistent format like YEAR-NUMBER (e.g., 2026-001, 2026-002). This keeps your records clean and is a legal requirement in the Netherlands.

### 6. Add a Personal Touch

A simple "Thank you for your business" at the bottom of the invoice goes a long way. You are a tradesperson who deals with people face to face - your invoice should reflect that relationship.

## Common Plumbing Invoice Mistakes

- **Not listing materials separately**: Clients want to see what they are paying for. A single line saying "materials €200" looks suspicious.
- **Forgetting the call-out fee**: If you charge for showing up, put it on the invoice. Do not surprise the client.
- **No job reference or address**: Always include where the work was done. This helps with both record-keeping and any warranty claims.
- **Handwritten invoices**: We get it - you are busy. But handwritten invoices look unprofessional and are easy to lose. Switch to digital.

## Save Time with Invoice Software

Creating invoices from scratch every time is tedious. A good invoicing tool lets you:

- Save client details for repeat customers
- Set up templates with your standard rates
- Calculate BTW automatically
- Send reminders when invoices are overdue
- Track which invoices are paid and which are not

As a plumber, your time is better spent fixing pipes than fiddling with spreadsheets. A proper invoicing tool pays for itself after the first late payment it helps you avoid.

## Related Resources

- [How Much Should a Plumber Charge Per Hour in the Netherlands (2026)](/blog/plumber-hourly-rate-netherlands-2026)
- [How to Create a Professional Invoice as a ZZP'er in the Netherlands](/blog/how-to-create-professional-invoice-zzp-netherlands)
- [How to Chase Late Payments Without Losing Clients](/blog/chase-late-payments-without-losing-clients)
- [Download a free invoice template](/templates)
`,
  },
  {
    slug: "btw-vat-rules-self-employed-netherlands-2026",
    title: "BTW/VAT Rules for Self-Employed in the Netherlands (2026 Guide)",
    excerpt: "A straightforward guide to Dutch BTW rules for ZZP'ers - covering 21% and 9% rates, the KOR scheme, reverse charge mechanism, and quarterly filing deadlines.",
    date: "2026-03-15",
    readTime: "8 min read",
    keyword: "btw zzp netherlands",
    metaDescription: "Complete 2026 guide to BTW/VAT rules for self-employed (ZZP) in the Netherlands. Covers 21% and 9% rates, KOR scheme, reverse charge, and quarterly filing requirements.",
    content: `
## BTW Basics: What Every ZZP'er Needs to Know

BTW (Belasting over de Toegevoegde Waarde) is the Dutch version of VAT (Value Added Tax). If you are self-employed in the Netherlands, you almost certainly need to deal with BTW. The [Belastingdienst](https://www.belastingdienst.nl) administers all BTW obligations. For an English-language overview of Dutch business taxes, see [Business.gov.nl](https://business.gov.nl/regulation/vat/). This guide explains the rules in plain language - no accounting jargon, just what you actually need to know.

## The Two BTW Rates

In the Netherlands, there are two main BTW rates:

### 21% - The Standard Rate

This applies to most goods and services. If you are a plumber, electrician, painter, or builder, the majority of your work is charged at 21% BTW.

**Examples of services at 21%:**
- Emergency repairs
- New installations (electrical, plumbing, heating)
- Commercial/business premises work
- Consultancy and design services

### 9% - The Reduced Rate

The 9% rate applies to specific categories. For tradespeople, the most relevant one is:

- **Renovation and repair of homes older than 2 years**: The labour portion of renovation work on residential properties that are more than two years old qualifies for the 9% rate. The materials you supply with the work also get the 9% rate.

**Important distinction:** This only applies to existing homes, not new construction. And the property must be used for residential purposes (not commercial).

**Examples at 9%:**
- Painting the interior of a 10-year-old house: 9%
- Installing a new bathroom in a 5-year-old apartment: 9%
- Building a brand new extension: 21%
- Renovating a shop or office: 21%

### 0% - Zero Rate

The 0% rate applies to:
- Goods exported outside the EU
- Certain international transport services

Most tradespeople working within the Netherlands will not encounter this rate.

## The KOR Scheme (Kleineondernemersregeling)

The KOR is a scheme designed to simplify things for small businesses. Here is how it works:

### Who Qualifies?

You can opt for the KOR if your **annual turnover** is below **€20,000** (as of 2025, verify the current threshold with the Belastingdienst).

### What Does It Mean?

If you register for the KOR:

- You **do not charge BTW** to your customers
- You **do not file BTW returns** (no quarterly declarations)
- You **cannot deduct BTW** on your business purchases

### Should You Use It?

**The KOR makes sense if:**
- Your turnover is well below the threshold
- Most of your clients are private individuals (they cannot deduct BTW anyway)
- You want to minimize administrative work
- Your business expenses are low (so you are not missing out on much BTW deduction)

**The KOR does NOT make sense if:**
- You are close to the threshold (if you exceed it, you must retroactively charge BTW)
- You have significant business expenses where BTW deduction would save you money
- Most of your clients are businesses (they are indifferent to BTW because they deduct it)

### How to Register

You opt in to the KOR by notifying the [Belastingdienst](https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/kleineondernemersregeling). The registration takes effect from the start of a calendar quarter. Once you opt in, you must stay in the scheme for at least 3 years (unless your turnover exceeds the threshold).

## Reverse Charge Mechanism (Verlegging)

The reverse charge mechanism shifts the BTW liability from the seller to the buyer. You will encounter this in two situations:

### 1. Subcontracting in Construction

If you are a subcontractor working for another contractor (aannemer), the reverse charge applies. Instead of charging BTW, you write "BTW verlegd" (VAT reverse-charged) on your invoice. The main contractor then accounts for the BTW in their own return.

**When this applies:**
- You are providing construction/installation services
- Your client is a business that also provides construction services
- You are a subcontractor, not the main contractor dealing with the end client

**Example:** You are a plumber hired by a general contractor to do the plumbing in a renovation. You invoice the general contractor for €5,000 and write "BTW verlegd" instead of adding 21% BTW. The general contractor handles the BTW in their own filing.

### 2. Cross-Border B2B Services within the EU

If you provide services to a business in another EU country, you generally do not charge Dutch BTW. Instead, the reverse charge applies. You must:

- Verify the client's VAT number (use the VIES system)
- Write "BTW verlegd" on the invoice
- Include the client's VAT number on the invoice
- Report the transaction in your ICP (Intracommunautaire Prestaties) declaration

## Filing Your BTW Return

### Quarterly Filing

Most ZZP'ers file BTW returns quarterly. The deadlines are:

| Quarter | Period | Filing Deadline |
|---|---|---|
| Q1 | January – March | 30 April |
| Q2 | April – June | 31 July |
| Q3 | July – September | 31 October |
| Q4 | October – December | 31 January |

You must file AND pay by the deadline. Late filing results in a fine starting at €68 and can increase significantly for repeated offences.

### What Goes on the Return?

Your quarterly BTW return includes:

- **BTW you charged** (output BTW / af te dragen BTW): The total BTW on all invoices you sent
- **BTW you paid** (input BTW / voorbelasting): The total BTW on business expenses you want to deduct
- **The difference**: If you charged more than you paid, you owe the difference to the Belastingdienst. If you paid more than you charged, you get a refund.

### A Simple Example

**Q1 2026:**
- You sent invoices totalling €20,000 + €4,200 BTW = €24,200
- You had business expenses of €3,000 + €630 BTW = €3,630
- BTW to pay: €4,200 - €630 = **€3,570**

You file your Q1 return before 30 April and pay €3,570 to the Belastingdienst.

## BTW on Business Expenses You Can Deduct

As a ZZP'er, you can deduct the BTW on legitimate business expenses:

- **Tools and equipment**: Power tools, hand tools, safety equipment
- **Vehicle costs**: Fuel, maintenance, insurance (proportional to business use)
- **Materials**: Pipes, cables, fittings, paint - anything you buy for jobs
- **Professional services**: Accountant fees, software subscriptions, insurance
- **Office costs**: Rent, utilities, internet (proportional to business use)
- **Training and courses**: Professional development related to your trade

**Keep all receipts and invoices.** The Belastingdienst can ask for proof up to 7 years after the tax year.

## Common BTW Mistakes

### 1. Mixing Up Rates

Applying 21% to renovation work that qualifies for 9% means your client overpays. Applying 9% to work that should be 21% means you underpay BTW. Both are problems.

### 2. Forgetting to File on Time

Set calendar reminders for filing deadlines. A €68 fine for late filing adds up quickly if it happens every quarter.

### 3. Not Separating Business and Personal Expenses

Use a separate business bank account. This makes it much easier to track BTW on business expenses and avoid mistakes.

### 4. Deducting BTW on Non-Deductible Items

Entertainment expenses, fines, and personal purchases are not deductible. Neither is BTW on food and drinks (with limited exceptions for business meetings).

## Tips for Managing BTW Efficiently

1. **Use accounting or invoicing software** that calculates BTW automatically and helps you prepare your quarterly return.
2. **Set aside 21% of every payment** you receive in a separate savings account for BTW. This way, you are never caught short at filing time.
3. **Keep digital copies** of all purchase receipts. A photo on your phone is fine - just make sure it is legible and stored securely.
4. **Review the KOR annually**: If your business is growing, you might need to deregister from the KOR. If it is shrinking, you might benefit from registering.
5. **Consult a boekhouder** (bookkeeper) if you are unsure. A good bookkeeper costs less than the mistakes they help you avoid.

## The Bottom Line

BTW is a fact of life for Dutch ZZP'ers, but it does not have to be complicated. Know your rates (21% standard, 9% for residential renovation), file on time, keep your receipts, and use software that handles the calculations. That way, you can spend your time doing what you are good at - not wrestling with tax forms.

## Related Resources

- [BTW Reverse Charge Mechanism Explained for Dutch Freelancers](/blog/btw-reverse-charge-dutch-freelancers)
- [KVK Invoice Requirements: What Every Dutch Freelancer Must Include](/blog/kvk-invoice-requirements-dutch-freelancers)
- [How to Create a Professional Invoice as a ZZP'er in the Netherlands](/blog/how-to-create-professional-invoice-zzp-netherlands)
- [Use our free BTW calculator](/tools)
`,
  },
  {
    slug: "chase-late-payments-without-losing-clients",
    title: "How to Chase Late Payments Without Losing Clients",
    excerpt: "Practical tips and ready-to-use reminder templates for getting paid on time in the Netherlands - without damaging your client relationships.",
    date: "2026-03-10",
    readTime: "7 min read",
    keyword: "late payment invoice netherlands",
    metaDescription: "Learn how to chase late payments professionally in the Netherlands. Includes payment reminder templates, the 30-day rule, legal options, and tips for maintaining client relationships.",
    content: `
## The Awkward Truth About Late Payments

You did the work. You sent the invoice. And now it has been 30 days and still no payment. Sound familiar?

Late payments are the single biggest cash flow problem for tradespeople and freelancers in the Netherlands. According to industry surveys, the average ZZP'er spends 15 hours per month chasing payments - time that should be spent earning money.

The challenge is clear: you need to get paid, but you also need to keep the client relationship intact. Especially when you are a plumber, electrician, or builder who relies on repeat business and referrals. This guide shows you how to handle late payments professionally and effectively.

## Understanding the Rules in the Netherlands

Before you start chasing, know your rights:

### The 30-Day Rule

Under [Dutch law](https://business.gov.nl/regulation/payment-term/) (and EU directive 2011/7/EU), business-to-business invoices must be paid within 30 days unless a different term is agreed in writing. For consumer invoices, the payment term stated on your invoice applies.

### Statutory Interest (Wettelijke Rente)

If a client pays late, you are legally entitled to charge interest:
- **B2B transactions**: 10.5% annual statutory commercial interest rate (2026)
- **Consumer transactions**: The standard statutory interest rate (currently around 6%)

Interest starts from the day after the payment deadline expires. You do not need to send a reminder first - the right to interest is automatic.

### Collection Costs (Incassokosten)

After sending a formal reminder (aanmaning) with a 14-day payment deadline, you can charge collection costs. The minimum is **€40** for amounts up to €2,500. These costs are set by law (Besluit vergoeding voor buitengerechtelijke incassokosten).

## The Payment Reminder Timeline

Here is a tested timeline that balances firmness with professionalism:

### Day 1 After Due Date: Friendly Reminder

**Template:**

> Subject: Friendly reminder - Invoice [number]
>
> Hi [Client Name],
>
> I hope everything is going well with the [work you did - e.g., "new bathroom"]. I noticed that invoice [number] for €[amount] was due on [date] and has not been paid yet.
>
> This is probably just an oversight. Could you arrange the payment when you get a chance? For your convenience, here are the details:
>
> Amount: €[amount]
> IBAN: [your IBAN]
> Reference: [invoice number]
>
> If you have already paid, please ignore this message.
>
> Thanks,
> [Your Name]

**Tone:** Casual, assuming it was forgotten. No pressure.

### Day 7: Second Reminder

**Template:**

> Subject: Payment reminder - Invoice [number]
>
> Hi [Client Name],
>
> I am following up on invoice [number] for €[amount], which was due on [date]. I sent a reminder last week but have not received payment yet.
>
> Could you let me know when I can expect the payment? If there is an issue with the invoice or if you need to discuss a payment arrangement, I am happy to talk.
>
> Payment details:
> Amount: €[amount]
> IBAN: [your IBAN]
> Reference: [invoice number]
>
> Thanks for your attention to this.
>
> Best regards,
> [Your Name]

**Tone:** Still polite, but directly asking for a timeline. Opens the door for discussion.

### Day 14: Formal Reminder (Aanmaning)

This is an important step legally. A formal reminder triggers your right to charge collection costs.

**Template:**

> Subject: Formal payment reminder - Invoice [number]
>
> Dear [Client Name],
>
> Despite previous reminders, invoice [number] for €[amount] dated [date] remains unpaid. The payment was due on [due date], which is now [X] days ago.
>
> I kindly but firmly request that you pay the outstanding amount within 14 days of this letter, before [date + 14 days].
>
> If payment is not received by this date, I will be entitled to charge statutory interest and collection costs in accordance with Dutch law. I would prefer to resolve this directly between us and avoid any additional costs for you.
>
> Outstanding amount: €[amount]
> IBAN: [your IBAN]
> Reference: [invoice number]
> Payment deadline: [date]
>
> If you have any questions or wish to discuss a payment arrangement, please contact me at [phone/email].
>
> Regards,
> [Your Name]

**Tone:** Formal and serious. Mentions legal consequences but still offers to talk.

### Day 30+: Final Notice Before Collection

**Template:**

> Subject: Final notice - Invoice [number]
>
> Dear [Client Name],
>
> This is a final notice regarding the unpaid invoice [number] for €[amount]. Despite multiple reminders, the payment due on [due date] has not been received.
>
> If the full amount is not paid within 7 days of this notice, I will transfer this matter to a collection agency / legal representative. This will result in additional costs for you, including statutory interest of [rate]% and minimum collection costs of €40.
>
> I strongly prefer to settle this matter directly. Please contact me at [phone/email] if you wish to discuss payment options.
>
> Outstanding amount: €[amount]
> Statutory interest to date: €[amount]
> IBAN: [your IBAN]
> Reference: [invoice number]
>
> Regards,
> [Your Name]

**Tone:** Final, clear consequences stated. Last chance before escalation.

## When to Escalate: Your Legal Options

If reminders do not work, you have several options in the Netherlands:

### 1. Incassobureau (Collection Agency)

A collection agency handles the chasing for you. They charge a fee (usually a percentage of the amount collected). Many clients pay as soon as they receive a letter from a collection agency.

**Cost:** Typically 10–25% of the collected amount
**Best for:** Amounts between €100 and €5,000

### 2. CJIB / e-Court / Digitaal Procederen

For straightforward cases where the debt is not disputed, you can use online legal procedures that are faster and cheaper than traditional courts.

### 3. Kantonrechter (Sub-District Court)

For amounts up to €25,000, you can file a claim with the kantonrechter. You do not need a lawyer for amounts under €25,000. The court fee (griffierecht) starts at around €90 for claims up to €500.

### 4. Write It Off

Sometimes, the cost of collection exceeds the invoice amount. For very small amounts or clients who have genuinely gone bankrupt, it might be more practical to write off the debt and learn from it.

## Prevention: How to Avoid Late Payments in the First Place

The best way to deal with late payments is to prevent them:

### 1. Send Invoices Immediately

The moment the work is done, send the invoice. Same-day invoicing gets you paid faster than waiting until the end of the week or month.

### 2. Use Short Payment Terms

14 days instead of 30. The data is clear: shorter payment terms lead to faster payments.

### 3. Make Paying Easy

Include your IBAN clearly on every invoice. Offer iDEAL or card payment options if possible. The fewer steps between seeing the invoice and paying it, the better.

### 4. Request Deposits for Large Jobs

For jobs over €1,000, it is completely normal to ask for a 30–50% deposit before starting work. This reduces your risk and ensures the client is committed.

### 5. Set Up Automatic Reminders

Manual chasing is time-consuming and easy to forget. Use invoicing software that sends automatic reminders at set intervals. Your software chases the money while you focus on your work.

### 6. Know Your Clients

For new clients, especially on large jobs, consider doing a quick check. Ask for references or require payment upfront. Trust is earned.

### 7. Get a Signed Quote First

Before starting any significant job, send a quote and get it accepted in writing (even a "yes" by email counts). This makes it much harder for a client to dispute the invoice later.

## Protecting the Relationship

Chasing payment feels uncomfortable, but remember:

- **You are not asking for a favour** - you are asking for what you earned
- **Most late payments are not malicious** - people forget, get busy, or have temporary cash flow issues
- **Being professional about it earns respect** - clients actually respect tradespeople who have their business in order
- **A client who does not pay is not a good client** - you are better off without them

The key is to be consistent, professional, and firm. Start friendly, escalate gradually, and always leave the door open for dialogue. Most payment issues resolve themselves with one or two reminders - the templates above handle the rest.

## Related Resources

- [How to Handle Late Payments in the Netherlands: Legal Steps and Timeline](/blog/late-payments-netherlands-legal-steps)
- [How to Create a Professional Invoice as a ZZP'er in the Netherlands](/blog/how-to-create-professional-invoice-zzp-netherlands)
- [ZZP Invoice Template: Free Download and Complete Guide](/blog/zzp-invoice-template-free-guide)
- [Download a free invoice template](/templates)
`,
  },
  {
    slug: "kvk-invoice-requirements-dutch-freelancers",
    title: "KVK Invoice Requirements: What Every Dutch Freelancer Must Include",
    excerpt: "A clear overview of all mandatory fields on invoices for KVK-registered businesses in the Netherlands - avoid fines and stay compliant.",
    date: "2026-03-05",
    readTime: "6 min read",
    keyword: "kvk invoice requirements",
    metaDescription: "Complete guide to KVK invoice requirements for Dutch freelancers. Learn all mandatory fields, avoid penalties, and understand the rules for digital vs paper invoices in the Netherlands.",
    content: `
## KVK Registration and Your Invoicing Obligations

When you register your business at the [Kamer van Koophandel (KVK)](https://www.kvk.nl), you take on certain legal obligations - including how you create and manage your invoices. The Netherlands has specific rules about what information must appear on business invoices, and the [Belastingdienst (Dutch Tax Authority)](https://www.belastingdienst.nl) enforces them.

This guide covers every mandatory field, common mistakes, penalties you could face, and practical advice for staying compliant without it becoming a headache.

## Mandatory Invoice Fields Under Dutch Law

Dutch invoicing requirements come from two sources: the BTW (VAT) legislation and the general commercial code. Here is the complete list of what must appear on every invoice:

### 1. Invoice Date

The date you issue the invoice. This is important for BTW purposes because it determines which quarter the invoice falls into.

### 2. Sequential Invoice Number

Every invoice must have a unique, sequential number. This means:
- No gaps in numbering (1, 2, 3 - not 1, 3, 7)
- No duplicate numbers
- A clear system (e.g., 2026-001, 2026-002 or INV-0001, INV-0002)

The Belastingdienst uses sequential numbering to verify that all invoices are accounted for during audits. Missing numbers trigger questions.

### 3. Your Business Name and Address

Your full legal name or trade name as registered with the KVK, plus your business address. This must match your KVK registration.

### 4. Your KVK Number

Your 8-digit KVK registration number must appear on every invoice. This is a legal requirement under the Handelsregisterwet (Trade Register Act).

**Where to find it:** On your KVK registration confirmation, or by searching the [KVK register online](https://www.kvk.nl/zoeken/).

### 5. Your BTW-id (VAT Identification Number)

Your BTW identification number in the format NL + 9 digits + B + 2 digits (e.g., NL123456789B01). This is mandatory on all invoices where BTW is charged.

**Note:** This is different from your BTW number used for filing returns. The BTW-id is specifically for putting on invoices and sharing with clients.

### 6. Client's Name and Address

The full name or company name and address of the client you are invoicing.

### 7. Client's VAT Number (for B2B)

If your client is a business and you are applying the reverse charge mechanism or dealing with cross-border EU transactions, you must include their VAT number.

### 8. Description of Goods or Services

A clear description of what you delivered or which services you performed. Vague descriptions like "services" or "work done" are not sufficient. Be specific:

**Bad:** "Plumbing work - €500"
**Good:** "Replacement of kitchen mixer tap and repair of leaking waste pipe at Vondelstraat 45, Amsterdam - 3 hours labour at €75/hr, materials as listed below"

### 9. Quantity and Unit Price

For each line item, show the quantity (hours, units, metres, etc.) and the price per unit.

### 10. BTW Rate and Amount

For each line item or group of items, state:
- The applicable BTW rate (21%, 9%, or 0%)
- The BTW amount in euros

If different rates apply to different items on the same invoice, group them separately and show the BTW calculation for each group.

### 11. Total Amount Excluding BTW

The sum of all line items before BTW.

### 12. Total Amount Including BTW

The final amount the client must pay.

### 13. Payment Terms

When payment is due (e.g., "Payment due within 14 days of invoice date"). While not strictly mandatory under BTW law, it is required for enforcing payment deadlines under commercial law.

### 14. Your Bank Account (IBAN)

Technically not legally required on the invoice itself, but practically essential - and expected by the Belastingdienst as part of good business practice.

## Special Cases and Additional Requirements

### Credit Notes

If you need to correct an invoice (wrong amount, returned goods, cancelled service), you issue a credit note. A credit note must:
- Have its own sequential number
- Reference the original invoice number
- Show the corrected amounts
- Include all the same mandatory fields as a regular invoice

### Invoices Under €100 (Simplified Invoices)

For invoices under €100 (including BTW), you can use a simplified invoice with fewer requirements:
- Your name and address
- Invoice date
- Description of goods/services
- Total amount including BTW
- The BTW amount or the rate applied

This is rarely used by tradespeople since most jobs exceed €100, but it is useful for small supply sales.

### Self-Billing (Factoring)

If your client issues the invoice on your behalf (common in some subcontracting arrangements), the invoice must include all the same mandatory fields and be marked as "factuur opgesteld door afnemer" (invoice drawn up by the buyer).

### Reverse Charge Invoices

When the reverse charge mechanism applies (e.g., subcontracting in construction), your invoice must:
- NOT include BTW
- State "BTW verlegd" (VAT reverse-charged)
- Include the client's VAT number

## Digital vs Paper Invoices

Good news: **digital invoices have the same legal status as paper invoices** in the Netherlands. There is no requirement to send paper invoices. A PDF sent by email is perfectly valid.

### Requirements for Digital Invoices

- **Authenticity**: The recipient must be able to verify who sent the invoice. Email from your business email address is sufficient.
- **Integrity**: The content must not be altered after sending. PDF format is the standard because it is difficult to modify without detection.
- **Readability**: The invoice must be legible throughout the retention period (7 years).

### Storage Requirements

You must store copies of all invoices (sent and received) for **7 years**. Digital storage is fine - you do not need paper copies. However:
- The files must be accessible and readable
- You must be able to produce them if the Belastingdienst asks
- Cloud storage is acceptable as long as you maintain access

## Penalties for Non-Compliance

The Belastingdienst can impose penalties for invoice-related violations:

### Missing or Incorrect BTW Information

If your invoices lack mandatory BTW fields, you risk:
- **Loss of BTW deduction rights** for your clients (they cannot deduct BTW from an incomplete invoice)
- **Fines** starting at €68 per violation
- **Correction assessments** if the Belastingdienst determines you underpaid BTW

### Missing KVK Number

Under the Handelsregisterwet, failing to include your KVK number on invoices can result in fines. The maximum fine is €22,500, though in practice, first offences for small businesses typically result in a warning or a smaller fine.

### Non-Sequential Invoice Numbers

Gaps or duplicates in your invoice numbering can trigger an audit. While not a fine in itself, it signals potential issues to the Belastingdienst and invites closer scrutiny of your records.

### Failure to Retain Invoices

Not keeping invoices for the required 7 years can result in estimated assessments - the Belastingdienst will estimate your income and tax liability, which is almost always higher than reality.

## Practical Tips for Staying Compliant

### 1. Use Invoicing Software

The easiest way to ensure compliance is to use software that includes all mandatory fields automatically. Good invoicing software:
- Generates sequential invoice numbers
- Includes your KVK and BTW-id on every invoice
- Calculates BTW correctly
- Stores copies digitally for the required 7 years

### 2. Set Up Your Template Once

Whether you use software or a template, set it up correctly once with all your business details, and you never have to think about it again.

### 3. Double-Check Your First Few Invoices

When you start your business or switch to new invoicing software, have someone check your first few invoices against the checklist above. Mistakes in your template get repeated on every invoice.

### 4. Keep Your KVK Registration Updated

If you change your business address, trade name, or activities, update your KVK registration. Your invoices must match your registration.

### 5. Separate Your BTW-id from Your BSN

Your BTW-id is for invoices and business communications. Your BSN (Burger Service Nummer) is your personal identification number and should NEVER appear on invoices. This is a common mistake that creates a privacy risk.

## Quick Compliance Checklist

Before sending any invoice, verify it includes:

- [ ] Invoice date
- [ ] Sequential invoice number
- [ ] Your business name and address
- [ ] Your KVK number
- [ ] Your BTW-id
- [ ] Client name and address
- [ ] Clear description of goods/services
- [ ] Quantity and unit price for each item
- [ ] BTW rate and amount per item/group
- [ ] Total excluding BTW
- [ ] Total including BTW
- [ ] Payment terms
- [ ] Your IBAN

If all boxes are checked, you are compliant. Use invoicing software that handles this automatically, and you will never have to run through this checklist manually again.

## Related Resources

- [How to Create a Professional Invoice as a ZZP'er in the Netherlands](/blog/how-to-create-professional-invoice-zzp-netherlands)
- [ZZP Invoice Template: Free Download and Complete Guide](/blog/zzp-invoice-template-free-guide)
- [BTW/VAT Rules for Self-Employed in the Netherlands (2026 Guide)](/blog/btw-vat-rules-self-employed-netherlands-2026)
- [Download a free invoice template](/templates)
`,
  },
  {
    slug: "zzp-invoice-template-free-guide",
    title: "ZZP Invoice Template: Free Download and Complete Guide",
    excerpt: "Everything you need to create a compliant ZZP invoice in the Netherlands - free template breakdown, mandatory fields, and common mistakes to avoid.",
    date: "2026-03-28",
    readTime: "9 min read",
    keyword: "zzp invoice template",
    metaDescription: "Free ZZP invoice template and complete guide for Dutch freelancers. Learn what must be on a ZZP factuur, download a free template, and avoid common invoicing mistakes in the Netherlands.",
    content: `
## Why Every ZZP'er Needs a Solid Invoice Template

Starting as a ZZP'er (zelfstandige zonder personeel) in the Netherlands is exciting. You have your KVK registration, your first clients, and the freedom to run your own business. But there is one thing that trips up nearly every new freelancer: invoicing.

A bad invoice can delay payment by weeks, create problems with the Belastingdienst, and make you look unprofessional. A good invoice template solves all of that. It ensures every invoice you send is compliant, clear, and easy for your client to pay.

This guide breaks down exactly what must be on a ZZP invoice, walks through a complete template line by line, and highlights the mistakes that cost freelancers real money.

## What Must Be on a ZZP Invoice in the Netherlands

The [Dutch tax authority (Belastingdienst)](https://www.belastingdienst.nl) has clear rules about what every invoice must contain. These are not suggestions - they are legal requirements. Missing any of them can result in fines, rejected BTW deductions for your client, or problems during an audit.

### Your Business Information

Every invoice must include:

- **Your full business name** (or trade name as registered with KVK)
- **Your business address** (must match your KVK registration)
- **Your KVK number** - the 8-digit number from your Chamber of Commerce registration
- **Your BTW-id** - your VAT identification number in the format NL + 9 digits + B + 2 digits (e.g., NL123456789B01)

Important: your BTW-id is not the same as your BSN (citizen service number). Never put your BSN on an invoice. This is a privacy risk and a common mistake among new ZZP'ers.

### Client Information

- **Client's full name or company name**
- **Client's address** (street, postal code, city)
- **Client's VAT number** (required for B2B invoices, especially cross-border)

### Invoice Details

- **Invoice number** - must be sequential and unique. Use a system like 2026-001, 2026-002, 2026-003. No gaps, no duplicates.
- **Invoice date** - the date you issue the invoice
- **Description of services or goods** - be specific. "Consulting" is not enough. Write "Web development - redesign of product pages, 15 hours at agreed rate" or "Plumbing repair - replacement of kitchen mixer tap at Keizersgracht 123, Amsterdam."
- **Quantity and unit price** - break down each line item
- **BTW rate and amount** - show which rate applies (21% standard, 9% reduced, or 0%) and the calculated tax
- **Total excluding BTW**
- **Total including BTW**

### Payment Information

- **Your IBAN** (bank account number)
- **Payment terms** - when payment is due. The standard in the Netherlands is 14 or 30 days.
- **BIC/SWIFT code** (optional, but helpful for international clients)

## Free ZZP Invoice Template Breakdown

Here is a complete example of what a proper ZZP invoice looks like. Use this as your reference when setting up your own template.

**From:**
Sophie Bakker Web Development
Oudezijds Voorburgwal 200, 1012 GH Amsterdam
KVK: 87654321
BTW-id: NL987654321B01
Email: sophie@example.nl
Phone: +31 6 12345678

**To:**
TechStart B.V.
Singel 542, 1017 AZ Amsterdam
BTW: NL856432179B01

**Invoice number:** 2026-007
**Invoice date:** 28 March 2026
**Due date:** 11 April 2026 (14 days)

| Description | Hours | Rate | Amount |
|---|---|---|---|
| Frontend development - product page redesign | 12 | €85.00 | €1,020.00 |
| Backend API integration - payment module | 8 | €85.00 | €680.00 |
| Code review and testing | 3 | €85.00 | €255.00 |
| Project management and client meetings | 2 | €85.00 | €170.00 |

**Subtotal:** €2,125.00
**BTW 21%:** €446.25
**Total:** €2,571.25

**Payment details:**
IBAN: NL91 ABNA 0417 1643 00
Reference: 2026-007
Payment due: 11 April 2026

Notice how every mandatory field is present. The descriptions are specific. The BTW is calculated and shown separately. The payment details are clear and easy to find.

## Line-by-Line Explanation

### The Header

Your business name, address, KVK, and BTW-id go at the top. This is your identity as a business. If you have a logo, include it - but it is not legally required.

### Client Details

Include enough information to clearly identify who you are billing. For B2B invoices, always include their VAT number. This is especially important for cross-border EU invoices.

### Invoice Number and Date

Your numbering system can be anything as long as it is sequential. Popular formats:
- Year-based: 2026-001, 2026-002
- Simple: INV-0001, INV-0002
- Project-based: PRJ-WEB-001 (less common but acceptable)

The date should be the date you actually issue the invoice, not the date you completed the work.

### Line Items

This is where most ZZP'ers either do too little or too much. The goal is clarity:

**Too vague:** "Development work - €2,125"
**Too detailed:** Listing every single git commit and email
**Just right:** Grouping by logical phases or deliverables, with hours and rates

Each line should answer: what did you do, how much of it, and what does it cost?

### BTW Section

If you charge BTW (most ZZP'ers do), show:
1. The subtotal before tax
2. The BTW rate (21% is standard for most services)
3. The BTW amount
4. The total including BTW

If you are registered for the KOR (small business scheme) and do not charge BTW, state this on the invoice: "BTW niet van toepassing op grond van de Kleineondernemersregeling."

If the reverse charge applies: "BTW verlegd" and include the client's VAT number.

### Payment Section

Make it as easy as possible for your client to pay. Include:
- Your IBAN in a standard format with spaces (NL91 ABNA 0417 1643 00)
- The invoice number as payment reference
- A clear due date

## Common Mistakes That Cost ZZP'ers Money

### 1. Using Your BSN Instead of BTW-id

Your BSN is personal. Your BTW-id is for business. Putting your BSN on invoices is a privacy violation and can lead to identity fraud. Always use your BTW-id.

### 2. Non-Sequential Invoice Numbers

Skipping numbers (going from 005 to 008) raises red flags with the Belastingdienst. They will want to know what happened to 006 and 007. Use invoicing software that assigns numbers automatically.

### 3. Vague Descriptions

"Services rendered" tells the Belastingdienst nothing. It also makes it easier for clients to dispute the invoice. Be specific about what you did, where, and when.

### 4. Forgetting to State BTW Exemptions

If you do not charge BTW (because of KOR, reverse charge, or export), you must state why on the invoice. Simply leaving the BTW line blank is not enough.

### 5. Not Including Payment Terms

Without a stated payment term, the legal default for B2B is 30 days. But if you want 14 days, you must put it on the invoice. And if a client pays late, having clear terms on the invoice strengthens your legal position.

### 6. Mixing Currencies Without Clarity

If you work with international clients and invoice in a currency other than EUR, state the exchange rate used and the EUR equivalent. The Belastingdienst requires BTW amounts in euros.

### 7. Sending Invoices Late

The sooner you invoice, the sooner you get paid. Waiting until the end of the month to batch your invoices delays your cash flow by weeks. Send the invoice the same day you complete the work.

## Different Invoice Scenarios for ZZP'ers

### Standard B2B Invoice (Netherlands)

The example above covers this. Include all mandatory fields, charge 21% BTW, and specify payment terms.

### B2C Invoice (Private Customers)

Same requirements, but you do not need the client's VAT number. The total amount should be shown including BTW, since consumers care about the final price.

### EU Cross-Border Invoice

When invoicing a business in another EU country:
- Do NOT charge Dutch BTW
- Write "BTW verlegd" (VAT reverse-charged) on the invoice
- Include the client's EU VAT number
- Verify their VAT number using the VIES system before invoicing
- Report the transaction in your ICP declaration

### Invoice with KOR Exemption

If you are registered for the Kleineondernemersregeling:
- Do NOT charge BTW
- State on the invoice: "BTW niet van toepassing op grond van de Kleineondernemersregeling"
- Do not show BTW amounts or rates

### Credit Note

If you need to correct a previous invoice:
- Create a new document with its own sequential number
- Reference the original invoice number
- Show the corrected amounts with negative values
- Include all the same mandatory fields

## Tips for a Professional ZZP Invoice

1. **Use consistent branding** - same font, logo, and colours on every invoice. It builds recognition and trust.

2. **Add a personal note** - a one-line "Thank you for your business" makes a difference. It is small but memorable.

3. **Include multiple contact methods** - email and phone at minimum. If a client has a question about the invoice, make it easy for them to reach you.

4. **State your terms clearly** - beyond payment terms, consider adding a line about late payment consequences: "Statutory interest and collection costs may apply for late payment."

5. **Number your pages** - for multi-page invoices, include "Page 1 of 2" etc. This is especially important if you send paper invoices.

6. **Keep a copy of everything** - Dutch law requires you to retain invoices for 7 years. Use software that stores them automatically.

## Using Software vs Manual Templates

### Manual Templates (Word, Excel, Google Docs)

Pros:
- Free
- Full control over design
- No learning curve

Cons:
- Manual invoice numbering (error-prone)
- Manual BTW calculations
- No automatic reminders
- No storage or backup
- Easy to make mistakes

### Invoicing Software

Pros:
- Automatic sequential numbering
- BTW calculated for you
- Automatic payment reminders
- Digital storage for 7+ years
- Professional templates included
- Time saved on every invoice

Cons:
- Monthly cost (though many offer free tiers)
- Initial setup time

For most ZZP'ers, invoicing software pays for itself within the first month through time savings alone. The reduction in errors and faster payments are bonuses.

## The Bottom Line

Your invoice template is one of the most important tools in your ZZP business. Get it right once, and every invoice you send will be compliant, professional, and clear. Get it wrong, and you risk delayed payments, Belastingdienst fines, and an unprofessional image.

Use the template breakdown in this guide as your starting point. Make sure every mandatory field is present. Be specific in your descriptions. And if you want to save time and avoid manual errors, consider using invoicing software like TradeInvoice that handles the compliance details automatically - so you can focus on your actual work.

## Related Resources

- [How to Create a Professional Invoice as a ZZP'er in the Netherlands](/blog/how-to-create-professional-invoice-zzp-netherlands)
- [KVK Invoice Requirements: What Every Dutch Freelancer Must Include](/blog/kvk-invoice-requirements-dutch-freelancers)
- [BTW/VAT Rules for Self-Employed in the Netherlands (2026 Guide)](/blog/btw-vat-rules-self-employed-netherlands-2026)
- [Download a free invoice template](/templates)
`,
  },
  {
    slug: "plumber-hourly-rate-netherlands-2026",
    title: "How Much Should a Plumber Charge Per Hour in the Netherlands (2026)",
    excerpt: "A data-driven guide to plumber hourly rates in the Netherlands for 2026 - covering average rates, factors that affect pricing, and how to set your own rate.",
    date: "2026-03-26",
    readTime: "10 min read",
    keyword: "plumber hourly rate Netherlands",
    metaDescription: "How much should a plumber charge per hour in the Netherlands in 2026? Covers average loodgieter uurtarief, pricing factors, regional differences, and how to calculate your ideal hourly rate.",
    content: `
## What Do Plumbers Actually Charge in the Netherlands?

If you are a plumber in the Netherlands trying to figure out what to charge, or a homeowner wondering if a quote is fair, you are not alone. Plumbing rates vary significantly depending on experience, location, specialization, and the type of work.

This guide provides a realistic overview of plumber hourly rates in the Netherlands for 2026, based on industry data and market analysis. No inflated numbers, no lowball estimates - just the facts.

## Average Plumber Hourly Rates in the Netherlands (2026)

Here are the current average rates for plumbing services:

| Experience Level | Hourly Rate (excl. BTW) | Hourly Rate (incl. 21% BTW) |
|---|---|---|
| Apprentice / Junior | €35 - €45 | €42 - €54 |
| Mid-level (3-5 years) | €45 - €60 | €54 - €73 |
| Experienced (5-10 years) | €55 - €75 | €67 - €91 |
| Specialist / Master | €70 - €100+ | €85 - €121+ |

These rates are for labour only and do not include materials, call-out fees, or VAT on materials.

### What About Call-Out Fees?

Most plumbers charge a separate call-out fee (voorrijkosten) on top of the hourly rate:

- **Standard call-out:** €25 - €50
- **Emergency / after-hours:** €50 - €100
- **Weekend / holiday:** €75 - €150

The call-out fee covers travel time, fuel, and the basic cost of dispatching. It is charged regardless of how long the actual work takes.

## Factors That Affect Your Hourly Rate

### 1. Location

Rates vary significantly by region in the Netherlands:

**Higher rates (Randstad area):**
- Amsterdam: €60 - €90/hr
- Rotterdam: €55 - €80/hr
- The Hague: €55 - €80/hr
- Utrecht: €55 - €80/hr

**Average rates (medium cities):**
- Eindhoven: €50 - €70/hr
- Groningen: €45 - €65/hr
- Tilburg: €45 - €65/hr
- Arnhem: €50 - €70/hr

**Lower rates (rural areas):**
- Drenthe: €40 - €55/hr
- Zeeland: €40 - €55/hr
- Friesland: €40 - €55/hr

The Randstad commands higher rates because of higher operating costs (rent, parking, insurance) and higher demand. In rural areas, competition is lower but so are living costs and client budgets.

### 2. Specialization

Specialized plumbers can charge significantly more than general plumbers:

- **General plumbing** (leaks, taps, toilets): €45 - €65/hr
- **Central heating / CV-ketel:** €55 - €80/hr
- **Bathroom renovation:** €50 - €75/hr
- **Drain cleaning (riool):** €60 - €85/hr
- **Gas installation (certified):** €65 - €90/hr
- **Sustainable / heat pump installation:** €70 - €100/hr

Gas installation and heat pump work command premium rates because they require additional certifications and carry higher liability.

### 3. Experience and Reputation

A plumber with 15 years of experience, a strong online reputation, and consistent referrals can charge 30-50% more than someone just starting out. Your track record is your most valuable pricing asset.

### 4. Emergency vs Scheduled Work

Emergency plumbing work (burst pipes, flooding, no hot water) commands a premium:

- **Scheduled work:** Standard hourly rate
- **Same-day urgent:** 25-50% surcharge
- **After-hours emergency (evenings):** 50-75% surcharge
- **Weekend/holiday emergency:** 75-100% surcharge

These surcharges are standard in the industry and expected by customers who need urgent help.

### 5. Type of Client

- **Private homeowners (B2C):** Tend to be more price-sensitive. Rates in the lower to middle range.
- **Property managers / housing corporations:** Regular work with consistent volume. Slightly lower rates but steady income.
- **Commercial / business clients (B2B):** Often willing to pay premium rates for reliability and quick response.
- **New construction contractors:** Lower hourly rates but high volume. Often project-based pricing.

## How to Calculate Your Ideal Hourly Rate

Many plumbers pick a number that "feels right" or copy what their colleagues charge. That is a mistake. Here is a better approach:

### Step 1: Calculate Your Annual Costs

Add up everything you spend to run your business for a year:

| Expense | Estimated Annual Cost |
|---|---|
| Tools and equipment | €2,000 - €5,000 |
| Vehicle (lease, fuel, insurance, maintenance) | €6,000 - €12,000 |
| Insurance (liability, disability, health) | €4,000 - €8,000 |
| Accounting / boekhouder | €1,000 - €2,500 |
| Phone, internet, software | €1,200 - €2,400 |
| Marketing / website | €500 - €2,000 |
| Training and certifications | €500 - €2,000 |
| Workspace / storage | €0 - €3,000 |
| Pension savings | €3,000 - €6,000 |
| **Total operating costs** | **€18,200 - €42,900** |

### Step 2: Determine Your Target Income

Decide what you want to take home after all costs and taxes. For example:
- Modest income: €35,000 net
- Comfortable income: €50,000 net
- High income: €70,000+ net

Remember that as a ZZP'er, you pay income tax (inkomstenbelasting) on your profit. At a €50,000 profit level, your effective tax rate is roughly 35-40% after deductions like the zelfstandigenaftrek and MKB-winstvrijstelling.

To take home €50,000, you need a gross profit of approximately €75,000 - €80,000.

### Step 3: Estimate Your Billable Hours

Not every hour you work is billable. Realistically:

- **Total working hours:** 1,800 - 2,000 per year (45-50 weeks x 40 hours)
- **Non-billable time** (admin, travel, quoting, marketing): 25-35%
- **Billable hours:** 1,200 - 1,500 per year

Most independent plumbers average about 1,200 - 1,300 billable hours per year.

### Step 4: Calculate Your Rate

**Formula:** (Annual costs + Target gross profit) / Billable hours = Hourly rate

**Example:**
- Operating costs: €30,000
- Target gross profit: €77,000 (to net €50,000)
- Billable hours: 1,300
- **Hourly rate: (€30,000 + €77,000) / 1,300 = €82/hr**

This means you need to charge approximately €82 per hour (excluding BTW) to cover your costs and take home €50,000 after taxes.

Many plumbers are surprised by this calculation. If you are charging €45/hr, you are either working significantly more hours, spending less on your business, or taking home much less than you think.

## Hourly Rate vs Fixed Price: When to Use Each

### Hourly Rate Works Best For:

- **Repair and maintenance work** where the scope is uncertain
- **Diagnostic work** (finding the source of a leak)
- **Small jobs** under 2-3 hours
- **Time and materials contracts** with commercial clients

### Fixed Price Works Best For:

- **Bathroom renovations** and other large projects with a clear scope
- **New installations** (boiler, heating system)
- **Repeat jobs** where you know exactly how long it takes
- **Competitive bids** where the client is comparing quotes

When quoting a fixed price, always add a 15-20% buffer for unexpected issues. Plumbing work, especially in older Dutch homes, frequently uncovers surprises behind walls and under floors.

## How to Raise Your Rates

If you have been charging the same rate for two or more years, you are effectively taking a pay cut due to inflation. Here is how to raise your rates without losing clients:

### 1. Announce in Advance

Give clients 30-60 days notice. A simple message: "As of 1 May 2026, my hourly rate will increase from €55 to €60 per hour to reflect increased operating costs."

### 2. Raise for New Clients First

The easiest way to increase your average rate is to quote higher for new clients. Your existing clients can be transitioned over time.

### 3. Add Value When You Raise

When you raise your rate, introduce something new: a warranty on your work, faster response times, or a follow-up check included in the price.

### 4. Be Confident

If you do good work, you are worth the rate. Clients who leave over a €5/hr increase were probably not your best clients anyway.

## Regional Rate Comparison: Real Numbers

Here is a more detailed breakdown of what plumbers charge across the Netherlands:

### Amsterdam and Surrounding Area
- Standard rate: €65 - €85/hr
- Emergency: €100 - €140/hr
- Call-out: €40 - €60
- Notes: Highest rates in the country. Parking and access challenges justify premium rates.

### Rotterdam and South Holland
- Standard rate: €55 - €75/hr
- Emergency: €85 - €120/hr
- Call-out: €30 - €50
- Notes: Slightly lower than Amsterdam but strong demand from port and industrial areas.

### Utrecht
- Standard rate: €55 - €75/hr
- Emergency: €85 - €115/hr
- Call-out: €30 - €50
- Notes: Growing city with strong residential demand.

### North Netherlands (Groningen, Friesland, Drenthe)
- Standard rate: €40 - €55/hr
- Emergency: €65 - €90/hr
- Call-out: €25 - €40
- Notes: Lower cost of living, less competition, larger travel distances.

### South Netherlands (Brabant, Limburg)
- Standard rate: €45 - €65/hr
- Emergency: €75 - €100/hr
- Call-out: €25 - €45
- Notes: Industrial areas around Eindhoven trend higher.

## What About Materials?

Your hourly rate covers labour. Materials are charged separately. Standard practice in the Netherlands:

- **Cost price + markup:** Most plumbers add 15-30% markup on materials
- **Transparency:** Always list materials separately on the invoice with quantities and unit prices
- **Standard items** (fittings, tape, sealant): Often included in the hourly rate as overhead
- **Significant materials** (taps, pipes, boilers): Always charged separately

A 20% markup on materials is standard and expected. It covers your time sourcing, transporting, and managing inventory.

## The Bottom Line

There is no single "correct" hourly rate for plumbers in the Netherlands. The right rate depends on your costs, your experience, your location, and the type of work you do. But if you do the math properly - factoring in all your costs, taxes, and non-billable time - most experienced plumbers should be charging between €55 and €85 per hour, excluding BTW.

Do not undercharge because you are afraid of losing clients. Charge what your work is worth, deliver excellent quality, and the right clients will be happy to pay. And if you want to save time on the invoicing side, tools like TradeInvoice help you create professional invoices in seconds - so you can spend less time on paperwork and more time growing your business.

## Related Resources

- [Invoice Template for Plumbers: Free Guide + Best Practices](/blog/invoice-template-plumbers-guide)
- [How to Create a Professional Invoice as a ZZP'er in the Netherlands](/blog/how-to-create-professional-invoice-zzp-netherlands)
- [BTW/VAT Rules for Self-Employed in the Netherlands (2026 Guide)](/blog/btw-vat-rules-self-employed-netherlands-2026)
- [Download a free invoice template](/templates)
`,
  },
  {
    slug: "electrician-invoice-template-guide",
    title: "Electrician Invoice Template: What to Include and How to Get Paid Faster",
    excerpt: "A complete guide to creating professional electrician invoices - covering specific line items for electrical work, safety references, material markup, and getting paid on time.",
    date: "2026-03-24",
    readTime: "9 min read",
    keyword: "electrician invoice template",
    metaDescription: "Free electrician invoice template and guide. Learn what to include on electrical work invoices, how to list safety certifications, mark up materials, and get paid faster.",
    content: `
## Why Electricians Need a Specific Invoice Template

Electrical work is different from other trades. It involves safety certifications, regulated materials, inspection requirements, and varying levels of complexity. A generic invoice template does not capture the details that matter for electrical services.

A good electrician invoice does three things: it gets you paid on time, it protects you legally, and it documents the work for future reference. This guide covers exactly what to include, with practical examples from real electrical jobs.

## The Essential Fields on Every Electrician Invoice

### Your Business Details

- **Business name** (as registered with KVK if you are in the Netherlands)
- **Business address**
- **KVK number** (8 digits)
- **BTW-id** (your VAT identification number)
- **Phone and email** (so clients can reach you with questions)
- **Insurance details** (optional but builds trust - e.g., "Fully insured - Liability insurance via [provider]")

### Client Information

- **Client name** (individual or company)
- **Property address** (where the work was performed - this may differ from the client's billing address)
- **Billing address** (if different from the work location)
- **Client's VAT number** (for B2B invoices)

### Invoice Specifics

- **Invoice number** (sequential - e.g., 2026-EL-001)
- **Invoice date**
- **Work date(s)** (when the electrical work was performed)
- **Payment terms** (14 or 30 days)

## How to Structure Line Items for Electrical Work

This is where electrician invoices differ from other trades. Here is how to structure your line items for maximum clarity:

### Labour Charges

Break your labour into categories that match the work phases:

| Description | Hours | Rate | Amount |
|---|---|---|---|
| Inspection and assessment of existing wiring | 1.0 | €65.00 | €65.00 |
| Removal of old consumer unit (meterkast) | 1.5 | €65.00 | €97.50 |
| Installation of new 12-way consumer unit | 3.0 | €65.00 | €195.00 |
| Wiring of new circuits (3x lighting, 2x power) | 4.0 | €65.00 | €260.00 |
| Testing and certification (NEN 1010) | 1.0 | €65.00 | €65.00 |
| Clean-up and client walkthrough | 0.5 | €65.00 | €32.50 |

**Total labour:** €715.00

This level of detail does several things:
- Shows the client exactly what they are paying for
- Documents the scope of work for warranty purposes
- Provides a reference for future electricians who work on the same property
- Protects you if there is ever a dispute

### Materials Charges

List materials separately with quantities, unit costs, and totals:

| Material | Qty | Unit Price | Amount |
|---|---|---|---|
| Hager 12-way consumer unit (VKG12B) | 1 | €185.00 | €185.00 |
| MCB 16A Type B (lighting circuits) | 3 | €8.50 | €25.50 |
| MCB 20A Type B (power circuits) | 2 | €9.00 | €18.00 |
| RCD 30mA 2-pole | 2 | €42.00 | €84.00 |
| NYM-J 3x2.5mm cable (50m roll) | 2 | €45.00 | €90.00 |
| NYM-J 3x1.5mm cable (50m roll) | 1 | €32.00 | €32.00 |
| Junction boxes, connectors, mounting hardware | 1 | €35.00 | €35.00 |

**Total materials:** €469.50

Tips for listing materials:
- Include brand and model numbers for major components (this helps for warranty claims)
- Group small items (screws, cable ties, tape) as "sundry materials" or "mounting hardware"
- Your markup (typically 15-25%) is built into the unit price - you do not need to show it separately
- Keep receipts for all materials in case of questions

### Additional Charges

| Description | Amount |
|---|---|
| Call-out / travel fee | €35.00 |
| Waste disposal (old wiring and components) | €25.00 |
| NEN 1010 inspection certificate | €75.00 |

## Safety Certifications and References

Electrical work in the Netherlands must comply with NEN 1010 (the Dutch electrical installation standard). Your invoice should reference relevant certifications and inspections:

### What to Include

- **NEN 1010 compliance statement:** "All work performed in accordance with NEN 1010:2020"
- **Inspection certificate reference:** If you performed a formal inspection, reference the certificate number
- **Your qualifications:** Include your electrical certification or registration (e.g., "Registered installation engineer" or your diploma reference)
- **Warranty statement:** "Labour guaranteed for 12 months from completion date. Manufacturer warranties apply to all installed components."

### Example Certification Block

Add this to the bottom of your invoice:

> **Compliance:** All electrical work performed in accordance with NEN 1010:2020. Installation tested and certified.
> Certificate number: NEN-2026-0342
> Installer: [Your name], registered electrician
> Warranty: 12 months on labour from date of completion

This block adds professionalism and protects you. If there is ever a question about the quality of your work, the invoice documents that it was done to standard.

## A Complete Electrician Invoice Example

Here is a full invoice example for a consumer unit (meterkast) replacement:

---

**Van der Berg Elektra**
Westerstraat 87, 1015 LZ Amsterdam
KVK: 76543210
BTW-id: NL765432109B01
Tel: +31 6 98765432
Email: info@vanderbergelektra.nl

**Invoice to:**
Restaurant De Gouden Leeuw
Damstraat 15, 1012 JL Amsterdam
BTW: NL821456739B01

**Invoice:** 2026-EL-012
**Date:** 24 March 2026
**Work performed:** 21-22 March 2026
**Payment due:** 7 April 2026 (14 days)

**Work location:** Damstraat 15, 1012 JL Amsterdam

| Description | Qty/Hrs | Rate | Amount |
|---|---|---|---|
| **Labour** | | | |
| Initial inspection and assessment | 1.5 hrs | €70.00 | €105.00 |
| Removal of existing consumer unit | 2.0 hrs | €70.00 | €140.00 |
| Installation of new 3-phase consumer unit | 4.5 hrs | €70.00 | €315.00 |
| Circuit wiring and connections | 3.0 hrs | €70.00 | €210.00 |
| Testing, certification, NEN 1010 compliance | 1.5 hrs | €70.00 | €105.00 |
| | | | |
| **Materials** | | | |
| Hager 3-phase 18-way consumer unit | 1 | €340.00 | €340.00 |
| MCB 16A 3-phase (various) | 6 | €18.50 | €111.00 |
| RCD 30mA 4-pole | 3 | €68.00 | €204.00 |
| Cable (various gauges, 150m total) | 1 | €210.00 | €210.00 |
| Mounting hardware and sundries | 1 | €45.00 | €45.00 |
| | | | |
| **Additional** | | | |
| Call-out fee (2 days) | 2 | €35.00 | €70.00 |
| Old unit disposal | 1 | €30.00 | €30.00 |

**Subtotal:** €1,885.00
**BTW 21%:** €395.85
**Total:** €2,280.85

**Payment details:**
IBAN: NL44 RABO 0312 4567 89
Reference: 2026-EL-012

**Compliance:** All work performed in accordance with NEN 1010:2020.
Certificate: NEN-2026-0342 | Installer: P. van der Berg, registered electrician
Warranty: 12 months on labour. Manufacturer warranties on all installed components.

---

## Getting Paid Faster: Practical Tips for Electricians

### 1. Invoice on the Same Day

The moment you finish the job, send the invoice. Do not wait until Friday afternoon to batch your invoices. Same-day invoicing can reduce your average payment time by 5-10 days.

### 2. Use 14-Day Payment Terms

The Dutch standard allows you to set your own terms. 14 days is appropriate for most residential and small commercial work. For larger projects, 30 days is common but always negotiate this upfront.

### 3. Collect Deposits on Large Jobs

For jobs over €500, request a 30-50% deposit before starting work. This is standard practice and protects you from non-payment. Frame it positively: "A 30% deposit secures your booking and covers material costs."

### 4. Accept Multiple Payment Methods

The easier it is to pay, the faster you get paid. At minimum, include your IBAN. Consider also accepting:
- iDEAL (via a payment link)
- Tikkie for smaller amounts
- Credit/debit card via a mobile terminal

### 5. Set Up Automatic Reminders

Do not manually chase payments. Use invoicing software that sends automatic reminders at 1 day, 7 days, and 14 days overdue. This saves you time and maintains consistency.

### 6. Add Late Payment Terms to Your Invoice

Include a line: "Statutory interest and collection costs apply for payments received after the due date, in accordance with Dutch law."

This is not aggressive - it is standard business practice and it motivates timely payment.

### 7. Separate Materials and Labour on Quotes

When quoting for work, always show materials and labour separately. This builds trust and makes it harder for clients to haggle on your labour rate. They can see exactly where the money goes.

## Common Invoicing Mistakes Electricians Make

### Bundling Everything into One Line

"Electrical work - €2,280" tells the client nothing and invites disputes. Always break down labour, materials, and additional charges separately.

### Forgetting the Work Location

For electricians, the work location matters for warranty and compliance purposes. Always include the full address where the work was performed, even if it matches the billing address.

### Not Referencing Certifications

Your NEN 1010 compliance and certification references belong on the invoice. They document that the work was done properly and protect you if questions arise later.

### Undercharging for Testing Time

Testing and certification is skilled, essential work. Do not absorb it into your other line items. Charge for it explicitly - clients understand that safety verification takes time.

### Missing Call-Out Fees

If you charge a call-out fee, list it as a separate line item. Do not hide it in your hourly rate. Transparency builds trust.

## The Bottom Line

A well-structured electrician invoice is more than a payment request. It is a professional document that records what was done, confirms compliance, and protects both you and your client. Use specific line items, reference your certifications, list materials with detail, and make payment easy.

If you want to streamline your invoicing and spend less time on admin, TradeInvoice is built specifically for tradespeople like electricians. Create compliant, professional invoices in under a minute, with automatic BTW calculations, payment reminders, and digital storage - so you can focus on the work that matters.

## Related Resources

- [Invoice Template for Plumbers: Free Guide + Best Practices](/blog/invoice-template-plumbers-guide)
- [KVK Invoice Requirements: What Every Dutch Freelancer Must Include](/blog/kvk-invoice-requirements-dutch-freelancers)
- [ZZP Invoice Template: Free Download and Complete Guide](/blog/zzp-invoice-template-free-guide)
- [Download a free invoice template](/templates)
`,
  },
  {
    slug: "btw-reverse-charge-dutch-freelancers",
    title: "BTW Reverse Charge Mechanism Explained for Dutch Freelancers",
    excerpt: "A clear, practical guide to the BTW reverse charge (BTW verlegd) for ZZP'ers and freelancers in the Netherlands - when it applies, how to invoice, and common mistakes.",
    date: "2026-03-22",
    readTime: "9 min read",
    keyword: "btw verlegd",
    metaDescription: "Complete guide to the BTW reverse charge mechanism (BTW verlegd) for Dutch freelancers and ZZP'ers. Learn when it applies, how to create a reverse charge invoice, required text, and common mistakes to avoid.",
    content: `
## What Is the BTW Reverse Charge?

The reverse charge mechanism (verleggingsregeling) is a rule that shifts the responsibility for reporting and paying BTW from the seller to the buyer. Instead of charging BTW on your invoice and paying it to the Belastingdienst yourself, your client handles the BTW in their own tax return.

In Dutch, this is called "BTW verlegd" - which literally translates to "BTW shifted." You will see this phrase on invoices where the reverse charge applies.

For freelancers and ZZP'ers in the Netherlands, the reverse charge comes up in two main situations: subcontracting in the construction sector, and providing services to businesses in other EU countries. This guide covers both in detail with practical examples.

## When Does the Reverse Charge Apply?

### Situation 1: Subcontracting in Construction (Verlegging bij onderaanneming)

This is the most common reverse charge scenario for tradespeople in the Netherlands. It applies when:

1. **You are a subcontractor** providing construction, renovation, or installation services
2. **Your client is another contractor** (aannemer) who also provides construction services
3. The work qualifies as construction-related (bouwwerkzaamheden)

**What counts as construction work:**
- Building and renovation
- Plumbing installation
- Electrical installation
- Painting and decorating
- Roofing
- Plastering
- Floor laying
- HVAC installation
- Demolition

**Example:** You are an electrician. A general contractor hires you to wire a new apartment building. You invoice the general contractor for your work. Because you are a subcontractor providing construction services to another construction business, the reverse charge applies. You write "BTW verlegd" on your invoice and do NOT charge BTW.

**When it does NOT apply:**
- You are the main contractor invoicing the end client (homeowner, business that is not a construction company)
- You are selling materials only (not installation services)
- Your client is a private individual
- Your client is a business but not in the construction sector

### Situation 2: Cross-Border B2B Services Within the EU (Intracommunautaire diensten)

The reverse charge applies when you provide services to a business (B2B) in another EU country. The general rule under EU VAT law is that B2B services are taxed where the buyer is established - not where the seller is.

**Requirements:**
1. Your client is a business (not a private individual)
2. Your client is established in another EU member state
3. Your client has a valid EU VAT number
4. The service falls under the "general rule" for place of supply

**Example:** You are a freelance web developer in Amsterdam. A company in Berlin hires you for a project. You verify their German VAT number through the VIES system. On your invoice, you do not charge Dutch BTW. Instead, you write "BTW verlegd - VAT reverse-charged under Article 196 of EU VAT Directive 2006/112/EC."

The German company then accounts for the VAT in their German tax return. They both charge and deduct the VAT, so it is neutral for them.

### Situation 3: Specific Domestic Services

In some specific cases, the reverse charge applies to domestic (Netherlands-to-Netherlands) B2B services:

- **Staffing and temporary workers** in certain industries
- **Delivery of used materials and waste** (scrap metal, etc.)
- **Transfer of emission rights**

These are less common for typical freelancers but worth knowing about.

## How to Create a Reverse Charge Invoice

A reverse charge invoice looks like a normal invoice with some important differences. Here is what you must include:

### Mandatory Elements

1. **All standard invoice fields** (your details, client details, invoice number, date, descriptions, quantities, amounts)
2. **"BTW verlegd"** - this text must appear on the invoice
3. **Client's VAT number** - you must include your client's BTW-id or EU VAT number
4. **No BTW amount** - do not show any BTW calculation
5. **Amounts shown excluding BTW** - since you are not charging BTW, all amounts are ex-BTW

### For EU Cross-Border: Additional Requirements

- Reference to the reverse charge provision: "VAT reverse-charged under Article 196 of EU VAT Directive 2006/112/EC" (or the equivalent Dutch text: "BTW verlegd op grond van artikel 12, lid 2 Wet OB 1968")
- Your client's EU VAT number (verified through VIES)
- The transaction must be reported in your ICP declaration (Intracommunautaire Prestaties)

### For Construction Subcontracting: Additional Requirements

- The text "BTW verlegd" is sufficient
- Your client's Dutch BTW-id
- Clear description of the construction services provided

## Complete Reverse Charge Invoice Example: Construction

---

**Bakker Elektrotechniek**
Reguliersgracht 28, 1017 LT Amsterdam
KVK: 65432198
BTW-id: NL654321987B01

**Factuur aan:**
De Groot Bouw B.V.
Haarlemmerweg 100, 1014 BM Amsterdam
BTW-id: NL823456712B01

**Factuur:** 2026-022
**Datum:** 22 March 2026
**Betreft:** Elektra-installatie nieuwbouw Zuidas - Blok C

| Omschrijving | Uren | Tarief | Bedrag |
|---|---|---|---|
| Installatie elektra appartementen C01-C06 | 32 | €70.00 | €2,240.00 |
| Installatie groepenkast per appartement (6x) | 12 | €70.00 | €840.00 |
| Materialen (kabels, groepenkast, componenten) | - | - | €3,400.00 |
| NEN 1010 keuringen (6 appartementen) | 6 | €70.00 | €420.00 |

**Totaal: €6,900.00**

**BTW verlegd**

Betaling: binnen 14 dagen
IBAN: NL44 RABO 0312 4567 89
Referentie: 2026-022

---

Notice: no BTW calculation, no BTW line, just "BTW verlegd" and the total amount. The total is the amount the client pays.

## Complete Reverse Charge Invoice Example: EU Cross-Border

---

**Sophie Bakker Web Development**
Oudezijds Voorburgwal 200, 1012 GH Amsterdam
KVK: 87654321
BTW-id: NL987654321B01

**Invoice to:**
TechStart GmbH
Friedrichstrasse 123, 10117 Berlin, Germany
VAT: DE123456789

**Invoice:** 2026-008
**Date:** 22 March 2026
**Project:** E-commerce platform development - Phase 2

| Description | Hours | Rate | Amount |
|---|---|---|---|
| Frontend development - checkout flow | 20 | €85.00 | €1,700.00 |
| Backend API - payment integration | 15 | €85.00 | €1,275.00 |
| Testing and QA | 5 | €85.00 | €425.00 |

**Total: €3,400.00**

**VAT reverse-charged under Article 196 of EU VAT Directive 2006/112/EC.**

Payment due: 5 April 2026 (14 days)
IBAN: NL91 ABNA 0417 1643 00
BIC: ABNANL2A
Reference: 2026-008

---

## What Text Must You Include on the Invoice?

The exact text required depends on the scenario:

### Construction Subcontracting
**Required text:** "BTW verlegd"

That is it. Two words. But they must be clearly visible on the invoice.

### EU Cross-Border Services
**Required text (one of these):**
- "BTW verlegd" (minimum in Dutch)
- "VAT reverse-charged" (in English)
- "VAT reverse-charged under Article 196 of EU VAT Directive 2006/112/EC" (full reference)
- "Verlegging van BTW op grond van artikel 12, lid 2 Wet OB 1968" (Dutch legal reference)

For cross-border invoices, including the EU directive reference is recommended because it is universally recognized across EU countries.

## How to Report Reverse Charge in Your BTW Return

### Construction Subcontracting

In your quarterly BTW return:
- **Do not** include the reverse-charged amount in your output BTW (rubriek 1a/1b)
- **Do** include the amount in rubriek 1e (leveringen/diensten belast met BTW verlegd naar u)

Wait - that is for when YOU are the buyer. As the seller (subcontractor), you simply do not report BTW on these invoices. The amount is part of your turnover but with zero BTW.

### EU Cross-Border Services

- Report the amount in your ICP declaration (Opgaaf ICP) - this is a separate filing
- In your BTW return, include the amount in rubriek 3b (diensten verricht naar landen binnen de EU)
- File the ICP declaration for the same period as the BTW return

The ICP declaration lists each EU client separately with their VAT number and the total amount invoiced to them in the quarter. This allows EU tax authorities to cross-reference transactions.

## Common Mistakes to Avoid

### 1. Charging BTW When You Should Not

If the reverse charge applies and you charge BTW anyway, your client may refuse the invoice. Even if they pay it, they cannot properly deduct the BTW because the reverse charge should have applied. This creates problems for both of you.

### 2. Not Verifying Your Client's VAT Number

For EU cross-border reverse charges, you MUST verify your client's VAT number through the VIES system (ec.europa.eu/taxation_customs/vies) before issuing the invoice. If the number is invalid and you do not charge BTW, you are liable for the BTW yourself.

**Best practice:** Save a screenshot or PDF of the VIES verification for your records. Date-stamp it.

### 3. Forgetting to File the ICP Declaration

For EU cross-border services, the ICP declaration is mandatory. Forgetting to file it can result in fines and increased scrutiny from the Belastingdienst.

### 4. Applying Reverse Charge to B2C Transactions

The EU cross-border reverse charge only applies to B2B transactions. If your client is a private individual in another EU country, you charge Dutch BTW at the standard rate (with some exceptions for digital services).

### 5. Not Including "BTW verlegd" on the Invoice

If you forget to write "BTW verlegd" on a reverse charge invoice, it is technically non-compliant. Your client may reject it or have difficulty processing it in their accounting. Always include the text clearly.

### 6. Applying Reverse Charge to the Wrong Construction Work

The construction reverse charge only applies when you are subcontracting to another construction business. If you are working directly for a homeowner, property manager, or non-construction company, normal BTW rules apply.

## Frequently Asked Questions

### Can I still deduct BTW on my business expenses if I use reverse charge?

Yes. The reverse charge only affects how you invoice your clients. Your right to deduct BTW on your own purchases and expenses is not affected. You still claim input BTW (voorbelasting) on your quarterly return as normal.

### What if my client is in the UK (post-Brexit)?

The UK is no longer in the EU, so the EU reverse charge does not apply. Services to UK businesses are generally zero-rated for Dutch BTW purposes (no BTW charged). You should include the text "Export of services - no Dutch VAT applicable" and still include the UK client's VAT number if they have one. For UK VAT rules, see [HMRC's guidance on VAT](https://www.gov.uk/vat).

### Do I need to register for VAT in other EU countries if I use reverse charge?

Generally no. The whole point of the reverse charge is to avoid the need for foreign VAT registration. However, if you supply goods (not services) to another EU country, different rules may apply.

### What if my client does not have a valid VAT number?

If your EU client cannot provide a valid VAT number, you cannot apply the reverse charge. You must charge Dutch BTW at 21%. This makes it important to verify VAT numbers before starting work.

### How do I handle reverse charge with mixed invoices?

If an invoice covers both reverse-charge services and non-reverse-charge items (e.g., construction labour for a contractor + a material sale to a homeowner), split them into separate invoices. Do not mix reverse charge and normal BTW on the same invoice.

## The Bottom Line

The BTW reverse charge is straightforward once you understand when it applies. For construction subcontractors: if you are working for another construction company as a subcontractor, write "BTW verlegd" and do not charge BTW. For EU cross-border services: verify the client's VAT number, write "BTW verlegd," and file your ICP declaration.

The key is getting the details right on your invoice: include the right text, the client's VAT number, and report the transactions correctly in your BTW return. If you use invoicing software like TradeInvoice, much of this is handled automatically - you select the reverse charge option and the software adds the correct text, excludes BTW, and flags the transaction for your ICP filing.

## Related Resources

- [BTW/VAT Rules for Self-Employed in the Netherlands (2026 Guide)](/blog/btw-vat-rules-self-employed-netherlands-2026)
- [KVK Invoice Requirements: What Every Dutch Freelancer Must Include](/blog/kvk-invoice-requirements-dutch-freelancers)
- [How to Create a Professional Invoice as a ZZP'er in the Netherlands](/blog/how-to-create-professional-invoice-zzp-netherlands)
- [Use our free BTW calculator](/tools)
`,
  },
  {
    slug: "late-payments-netherlands-legal-steps",
    title: "How to Handle Late Payments in the Netherlands: Legal Steps and Timeline",
    excerpt: "The complete legal roadmap for collecting late payments in the Netherlands - from the first reminder to court proceedings, with timelines, costs, and templates.",
    date: "2026-03-20",
    readTime: "10 min read",
    keyword: "late payment Netherlands",
    metaDescription: "Complete guide to handling late payments in the Netherlands. Covers the 14-day WIK aanmaning, incassokosten, BIK rates, ingebrekestelling, collection agencies, and court steps for Dutch freelancers and businesses.",
    content: `
## Late Payments Are a Legal Matter, Not Just a Business Annoyance

In the Netherlands, late payment is not just frustrating - it has clear legal consequences. Dutch law provides a structured framework for collecting what you are owed, from friendly reminders all the way to court proceedings. The rules are surprisingly specific about timelines, interest rates, and costs.

This guide walks you through every step, with exact timelines, legal references, and practical advice for tradespeople and freelancers who need to get paid.

## Understanding Your Legal Rights

Before you send a single reminder, know what the law says:

### Payment Terms Under Dutch Law

- **B2B invoices:** Must be paid within 30 days unless a different term is agreed in writing. Under EU Directive 2011/7/EU (implemented in Dutch law), payment terms exceeding 60 days are only allowed if explicitly agreed and not unfair to the creditor.
- **B2C invoices:** The payment term on your invoice applies. If none is stated, "within a reasonable time" is the default - typically interpreted as 14-30 days.
- **Government contracts:** Public authorities must pay within 30 days. No exceptions.

### Statutory Interest (Wettelijke Rente)

The moment a payment is overdue, you are entitled to charge interest - automatically, without needing to send a reminder first.

**B2B transactions (wettelijke handelsrente):**
- Current rate (2026): 12.5% per year
- This rate is set by the European Central Bank + 8 percentage points
- Updated every 6 months (1 January and 1 July)

**B2C transactions (wettelijke rente):**
- Current rate (2026): 6% per year
- Lower than B2B because consumer protection rules apply

**How to calculate:**
Interest = Invoice amount x (Annual rate / 365) x Days overdue

Example: €2,000 invoice, 45 days overdue, B2B rate of 12.5%:
€2,000 x (0.125 / 365) x 45 = **€30.82** in interest

### Collection Costs (Incassokosten / Buitengerechtelijke Incassokosten - BIK)

After sending a formal 14-day reminder (the "WIK aanmaning" - Wet Incassokosten), you can charge standardized collection costs. These are set by law (Besluit vergoeding voor buitengerechtelijke incassokosten):

| Outstanding Amount | Collection Cost |
|---|---|
| Up to €2,500 | 15% (minimum €40) |
| €2,500 - €5,000 | €375 + 10% of amount over €2,500 |
| €5,000 - €10,000 | €625 + 5% of amount over €5,000 |
| €10,000 - €200,000 | €875 + 1% of amount over €10,000 |
| Over €200,000 | €2,775 + 0.5% of amount over €200,000 (max €6,775) |

**Examples:**
- €500 invoice: €75 in collection costs (15% of €500)
- €1,000 invoice: €150 in collection costs (15% of €1,000)
- €3,000 invoice: €375 + €50 = €425 in collection costs

These amounts are the maximum you can charge. They are designed to cover the cost of collection efforts without requiring you to prove actual expenses.

## The Complete Timeline: From Due Date to Court

### Phase 1: The Payment is Due (Day 0)

Your invoice stated "payment within 14 days" and the deadline has passed. At this point:
- The client is technically in default (verzuim)
- Statutory interest starts accruing automatically
- You cannot yet charge collection costs

**Action:** Wait 1-2 business days. Many payments cross in the post or are processed with a slight delay.

### Phase 2: Friendly Reminder (Day 1-3 After Due Date)

Send a friendly, informal reminder. This is not legally required but is good business practice.

**Template:**

> Subject: Herinnering - Factuur [nummer]
>
> Beste [naam],
>
> Graag herinner ik u aan factuur [nummer] van [datum] ter waarde van €[bedrag]. De betalingstermijn van [X] dagen is op [datum] verlopen.
>
> Waarschijnlijk is het u ontgaan. Zou u de betaling willen overmaken?
>
> Bedrag: €[bedrag]
> IBAN: [uw IBAN]
> Kenmerk: [factuurnummer]
>
> Heeft u al betaald? Dan kunt u dit bericht negeren.
>
> Met vriendelijke groet,
> [Uw naam]

**Why bilingual matters:** If your clients are Dutch, send reminders in Dutch. For international clients, use English. The legal requirements for the formal reminder (Phase 3) can be met in either language.

### Phase 3: The 14-Day WIK Aanmaning (Day 7-14 After Due Date)

This is the critical legal step. The Wet Incassokosten (WIK) requires you to send a formal written reminder giving the debtor exactly 14 days to pay. Only after this 14-day period expires can you charge collection costs.

**What the WIK aanmaning must include:**

1. A clear statement that the payment is overdue
2. The exact outstanding amount
3. A deadline of exactly 14 days to pay
4. A warning that collection costs will be charged if payment is not received within the deadline
5. The exact amount of collection costs that will be charged

**Template (Dutch - legally compliant):**

> Betreft: Aanmaning - Factuur [nummer]
>
> Geachte [naam],
>
> Ondanks eerdere herinnering(en) heb ik tot op heden geen betaling ontvangen van factuur [nummer] d.d. [datum] ter waarde van €[bedrag]. De betalingstermijn is op [datum] verlopen.
>
> Ik verzoek u vriendelijk maar dringend het openstaande bedrag van €[bedrag] binnen 14 dagen na dagtekening van deze brief over te maken.
>
> Indien ik het bedrag niet binnen 14 dagen na dagtekening van deze brief heb ontvangen, ben ik genoodzaakt buitengerechtelijke incassokosten in rekening te brengen. Deze kosten bedragen €[bedrag BIK] conform het Besluit vergoeding voor buitengerechtelijke incassokosten.
>
> Daarnaast ben ik gerechtigd de wettelijke (handels)rente in rekening te brengen over het openstaande bedrag.
>
> Betaalgegevens:
> Bedrag: €[bedrag]
> IBAN: [uw IBAN]
> Kenmerk: [factuurnummer]
>
> Mocht u vragen hebben of een betalingsregeling willen treffen, neem dan contact met mij op via [telefoon/email].
>
> Met vriendelijke groet,
> [Uw naam]

**Important notes:**
- Send this by email AND registered post (aangetekende brief) for B2B. For consumers, registered post is strongly recommended so you can prove delivery.
- The 14-day period starts the day after the debtor receives the letter
- Keep proof of sending (email delivery confirmation, postal tracking)

### Phase 4: The 14-Day Period Expires (Day 21-28 After Due Date)

If the 14-day WIK period expires without payment:
- You can now legally charge collection costs (BIK)
- Statutory interest continues to accrue
- The total debt is now: original amount + interest + collection costs

**Action:** Send a final notice stating the total amount now owed, including BIK costs and interest.

### Phase 5: Ingebrekestelling / Formal Notice of Default (Day 28-35)

If the WIK aanmaning does not result in payment, the next step is a formal notice of default (ingebrekestelling). While the client is already technically in default (verzuim) for payment obligations with a fixed due date, a written ingebrekestelling strengthens your legal position for any future proceedings.

**Template:**

> Betreft: Ingebrekestelling - Factuur [nummer]
>
> Geachte [naam],
>
> Ondanks herhaalde verzoeken is factuur [nummer] d.d. [datum] ten bedrage van €[bedrag] nog steeds niet voldaan. De betalingstermijn is op [datum] verlopen, nu [X] dagen geleden.
>
> Het totaal openstaande bedrag is thans:
> - Hoofdsom: €[bedrag]
> - Wettelijke (handels)rente: €[bedrag]
> - Buitengerechtelijke incassokosten: €[bedrag]
> - **Totaal: €[bedrag]**
>
> Ik stel u bij deze formeel in gebreke en verzoek u het volledige bedrag van €[totaal] binnen 7 dagen na dagtekening over te maken.
>
> Indien betaling uitblijft, zal ik de vordering uit handen geven aan een incassobureau of gerechtelijke stappen ondernemen. Alle bijkomende kosten komen voor uw rekening.
>
> [Betaalgegevens]
>
> Met vriendelijke groet,
> [Uw naam]

### Phase 6: External Collection or Legal Action (Day 35+)

If direct collection fails, you have several options:

#### Option A: Incassobureau (Collection Agency)

A professional collection agency takes over the collection process:

- **Cost:** Usually 10-25% of the collected amount (no cure, no pay is common)
- **Pros:** Professional, often effective just from the letter they send, saves your time
- **Cons:** You lose a percentage, relationship with client is usually over
- **Best for:** Amounts from €200 to €10,000

**How it works:**
1. You transfer the file (invoice, correspondence, proof of delivery)
2. The agency sends a collection letter
3. If no response, they follow up with phone calls and additional letters
4. If still no response, they advise on legal action

#### Option B: Kantonrechter (Sub-District Court)

For amounts up to €25,000, you can file a claim with the kantonrechter. You do not need a lawyer.

**Court fees (griffierecht) for 2026:**

| Claim Amount | Court Fee (natural persons) | Court Fee (legal entities) |
|---|---|---|
| Up to €500 | €92 | €138 |
| €500 - €2,500 | €192 | €510 |
| €2,500 - €5,000 | €276 | €510 |
| €5,000 - €12,500 | €552 | €1,384 |
| €12,500 - €25,000 | €552 | €1,384 |

**Process:**
1. File a dagvaarding (summons) through a deurwaarder (bailiff)
2. The deurwaarder serves the summons on the debtor
3. A court date is set (typically 4-8 weeks after filing)
4. If the debtor does not respond, you win by default (verstekvonnis)
5. If the debtor responds, the judge decides based on evidence

**Timeline:** 2-6 months from filing to judgment
**Cost:** Court fee + deurwaarder costs (approximately €100-€200) + your time

#### Option C: European Payment Order (for EU cross-border debts)

For debts from clients in other EU countries, the European Payment Order procedure provides a standardized process:

1. File Form A at your local court
2. The court issues an EOP to the debtor
3. If uncontested within 30 days, it becomes enforceable across the EU

This is faster and cheaper than pursuing a claim in a foreign court.

#### Option D: Write-Off

Sometimes the cost of collection exceeds the debt. Consider writing off if:
- The amount is under €200 and the client is unresponsive
- The client has genuinely gone bankrupt (failliet)
- You have no documentation to prove the debt

A written-off debt can be deducted as a business expense on your tax return.

## Practical Tips for the Collection Process

### 1. Document Everything

From the first reminder to the final notice, keep copies of every email, letter, and phone note. Screenshots of chat messages (WhatsApp, Signal) are valid evidence in Dutch courts.

### 2. Stay Professional

Angry messages, threats, or harassment will work against you - both in maintaining the relationship and in court. Stick to factual, professional communication.

### 3. Act Quickly

The older a debt gets, the harder it is to collect. Start the process within a week of the due date, not months later.

### 4. Know When to Negotiate

A partial payment or payment plan is often better than no payment at all. If a client offers to pay in instalments, put the agreement in writing:
- Total amount owed
- Number of instalments
- Amount per instalment
- Due date for each instalment
- Consequences of missing an instalment

### 5. Use the Right Language

For Dutch clients, send formal notices in Dutch. For international clients, English is fine for the informal reminders but consider having legal notices translated or issued in both languages.

### 6. Consider Your Ongoing Relationship

For one-time clients you will never work with again, be firm and escalate quickly. For repeat clients who are temporarily struggling, consider flexibility. But do not let sympathy override your business needs.

## Prevention Is Better Than Collection

The best approach to late payments is prevention:

### Before the Job
- Get a signed quote or agreement
- Request a deposit for large jobs (30-50%)
- Verify the client's identity and business registration
- Set clear payment terms upfront

### On the Invoice
- Use short payment terms (14 days)
- Include all payment details prominently (IBAN, reference)
- State late payment consequences
- Send the invoice on the same day you complete the work

### After Sending
- Set up automatic payment reminders (at 1, 7, and 14 days overdue)
- Track all outstanding invoices in one place
- Follow up consistently - do not let overdue invoices slip through the cracks

## Real-World Example: Complete Timeline

Here is what a typical late payment collection looks like in practice:

**1 March 2026:** You complete a bathroom renovation for €3,500 and send the invoice with 14-day payment terms.

**15 March 2026:** Payment deadline passes. No payment received.

**17 March 2026:** You send a friendly email reminder. No response.

**22 March 2026:** You send the formal WIK aanmaning by email and registered post, giving 14 days to pay and warning of €525 in collection costs (15% of €3,500).

**5 April 2026:** The 14-day WIK period expires. No payment. You can now charge:
- Original amount: €3,500.00
- Interest (21 days at 12.5%): €25.17
- Collection costs (BIK): €525.00
- **Total: €4,050.17**

**7 April 2026:** You send the ingebrekestelling with the total amount and a 7-day deadline.

**14 April 2026:** Still no payment. You transfer the file to an incassobureau. They send a collection letter within 2 business days.

**21 April 2026:** The client contacts the collection agency and agrees to pay the full amount in two instalments. Payment completed by 15 May 2026.

**Total time from due date to resolution:** 2 months. You recovered the full amount plus interest and collection costs.

## The Bottom Line

Late payment collection in the Netherlands follows a clear legal framework. The key steps are: friendly reminder, formal WIK aanmaning with 14-day deadline, ingebrekestelling, and then escalation to a collection agency or court. Know your rights to statutory interest and BIK collection costs. Act quickly and document everything.

If you want to automate the early stages of this process, invoicing software like TradeInvoice sends automatic payment reminders at configurable intervals - catching overdue invoices before they become collection problems. Prevention and early action are always cheaper than legal proceedings.

## Related Resources

- [How to Chase Late Payments Without Losing Clients](/blog/chase-late-payments-without-losing-clients)
- [KVK Invoice Requirements: What Every Dutch Freelancer Must Include](/blog/kvk-invoice-requirements-dutch-freelancers)
- [BTW/VAT Rules for Self-Employed in the Netherlands (2026 Guide)](/blog/btw-vat-rules-self-employed-netherlands-2026)
- [Use our free BTW calculator](/tools)
`,
  },
  {
    slug: "locksmith-invoice-template-guide",
    title: "Locksmith Invoice Template: Everything You Need to Get Paid Faster",
    excerpt: "A complete guide to creating a locksmith invoice that looks professional, covers your legal bases, and gets you paid without chasing clients.",
    date: "2026-03-22",
    readTime: "6 min read",
    keyword: "locksmith invoice template",
    metaDescription: "Create a professional locksmith invoice in minutes. Learn what to include, how to word emergency call-out fees, and download a free locksmith invoice template.",
    content: `
## What Makes a Locksmith Invoice Different

Most trades invoice for planned work - a quote agreed in advance, then an invoice at the end. Locksmithing is different. A large chunk of your work is emergency call-outs: 2am lockouts, broken locks after a break-in, lost keys. The job is done before anyone signs anything, and the client is stressed, possibly half-dressed in a doorway in January.

That is precisely why your locksmith invoice needs to be clear, itemised, and sent quickly. Clients who get a vague bill days later start questioning whether the charge was fair. Clients who get a detailed locksmith invoice template-style breakdown on the same day rarely dispute it.

## What to Include on a Locksmith Invoice

A solid locksmith invoice covers these sections:

**Your business details**
- Trading name and legal name
- Address, phone, and email
- KVK number (if operating in the Netherlands) or company registration
- VAT number (BTW-id in NL, VAT number in the UK)
- Invoice number (sequential - never skip or reuse)

**Job details**
- Date and time of the call-out - this is important for emergency pricing
- Address where the work was carried out
- Description of the problem: "Customer locked out of front door, Yale lock mechanism seized. Lock drilled and replaced with 5-pin Yale Superior."
- Parts used with individual prices: "Yale Superior 5-pin cylinder x1 - €38.50"
- Labour: break this into call-out fee + hourly or flat-rate labour

**Charges**
- Call-out fee (state this separately - it avoids arguments)
- Labour charge
- Parts
- Any after-hours surcharge, if applicable
- VAT / BTW at the correct rate
- Total

**Payment terms**
- For emergency residential work, payment on completion is standard and worth stating: "Payment due on completion of works."
- For commercial clients, net 14 or net 30 is normal.
- Include your bank details or accepted payment methods (cash, card, bank transfer)

## Wording That Prevents Disputes

The number one cause of invoice disputes in locksmithing is vague descriptions. Compare these two:

*Bad:* "Emergency call-out, lock replacement - £180 + VAT"

*Good:* "Emergency call-out 22:15 on 15 March. Customer locked out of property at 14 Elm Street. Front door uPVC lock failed (mechanism jammed). Replaced with Ultion 3-star anti-snap cylinder. Parts: Ultion cylinder £55. Labour (1 hr): £85. After-hours surcharge: £40."

The second version answers every question the client might have before they think to ask it. It also protects you if they dispute the charge with their bank or card issuer.

A few phrases worth keeping in your locksmith invoice template:

- "Emergency call-out fee applies outside standard hours (08:00-18:00 Mon-Fri)"
- "Parts are non-refundable once fitted"
- "Warranty: 12 months on parts and labour for manufacturer defects"

## Invoicing for Locksmith Work in the Netherlands

If you operate as a locksmith in the Netherlands (slotenmaker), you need to include your **KVK number** and **BTW-id** on every invoice. The BTW rate for labour is 21%. If you are on the kleineondernemersregeling (KOR) scheme and exempt from BTW, you still need to note "BTW vrijgesteld o.g.v. artikel 25 Wet OB 1968" on your invoice.

Dutch clients increasingly expect invoices by email as PDF. Sending a WhatsApp photo of a handwritten receipt will get you paid - once. It will not get you a repeat booking or a referral.

## Get Your Locksmith Invoice Template Set Up Once, Use It Forever

The smartest thing you can do is build your locksmith invoice as a template: your details pre-filled, your standard call-out fee pre-loaded, and the job-specific fields blank for you to fill in at the job. If you do 3-5 emergency call-outs a day, spending 2 minutes on each invoice instead of 10 adds up to hours saved per week.

[Create your free locksmith invoice template at TradeInvoice](https://tradeinvoice.vercel.app) - set it up once, send professional invoices from your phone in under a minute.
`,
  },
  {
    slug: "plumber-invoice-template-netherlands",
    title: "Plumber Invoice Template for the Netherlands: What to Include and Why",
    excerpt: "Invoicing for plumbers in the Netherlands explained: KVK, BTW rates, Dutch invoice requirements, and how to get paid on time every time.",
    date: "2026-03-26",
    readTime: "7 min read",
    keyword: "plumber invoice template",
    metaDescription: "A practical guide to creating a compliant plumber invoice in the Netherlands. Covers BTW rates, KVK requirements, payment terms, and a free plumber invoice template.",
    content: `
## Invoicing for Plumbers in the Netherlands: The Basics

Whether you are a self-employed plumber (ZZP loodgieter) or running a small plumbing firm, your invoices need to meet Dutch legal requirements. The Belastingdienst is not flexible on this - a missing BTW-id or no invoice number sequence can cause real problems during a tax check.

But beyond compliance, a well-structured plumber invoice template does something more valuable: it makes you look professional, reduces payment disputes, and gets money into your account faster.

## The Dutch Legal Requirements for a Plumber Invoice

Every invoice you send as a plumber in the Netherlands must include:

**Your details**
- Your full name or business name as registered with KVK
- Your KVK number (8 digits, e.g. 12345678)
- Your BTW-id (format: NL + 9 digits + B + 2 digits, e.g. NL123456789B01)
- Business address and contact details

**Client details**
- Client's name and address
- If they are a business: their VAT/BTW number (required for B2B invoices)

**Invoice specifics**
- A unique, sequential invoice number (2026-001, 2026-002 etc.)
- Invoice date
- Description of work: specific, not generic. "Leakage repair bathroom, replacement of flexi hose under washbasin, Keizersgracht 14, Amsterdam" is correct. "Plumbing work March" is not.
- Itemised costs: labour and materials listed separately
- BTW rate (21% on labour and most materials) and the calculated BTW amount
- Total excluding BTW and total including BTW
- Your IBAN and payment terms

## BTW Rates for Plumbing Work

For most plumbing jobs, BTW is 21%. However, there is one important exception: **renovation work on owner-occupied homes older than 2 years** qualifies for the reduced 9% BTW rate on labour (not materials). This applies to work like replacing a boiler, repairing pipework, or fitting a new bathroom in an existing home.

Many plumbers miss this distinction and charge 21% on everything. That is fine - it is not illegal - but some clients will know the rules and push back. Knowing the rates and applying them correctly makes you look sharp.

If you are on the KOR (kleineondernemersregeling) and exempt from charging BTW, you must still note this on every invoice: state "BTW vrijgesteld op grond van artikel 25 Wet OB 1968."

## Structuring Your Plumber Invoice Template

Here is a structure that works for most plumbing jobs:

**Header:** Your logo (optional but professional), your name, KVK, BTW-id, address

**Bill to:** Client name, address, client VAT number if applicable

**Job details:**
- Date of work
- Address where work was carried out
- Invoice number and invoice date

**Line items:**
| Description | Qty | Unit price | Total |
|---|---|---|---|
| Labour: boiler inspection and refit (2.5 hrs @ €65/hr) | 1 | €162.50 | €162.50 |
| Cv-ketel onderdelen (lijst bijgevoegd) | 1 | €87.00 | €87.00 |

**Totals:**
- Subtotal (excl. BTW)
- BTW 21% (or 9% on labour if applicable)
- **Total incl. BTW**

**Payment:** IBAN NL XX XXXX XXXX XXXX XX - betaling binnen 14 dagen

## Getting Paid on Time

Dutch B2C clients (homeowners) usually pay promptly if given easy options: iDEAL, bank transfer with a clear reference, or card. For B2B clients (property managers, housing corporations), net 30 is standard but net 14 is perfectly acceptable and worth asking for.

Include a late payment clause on every invoice: "Bij te late betaling is 1% rente per maand verschuldigd en worden incassokosten in rekening gebracht conform de Wet Incassokosten." This is legally enforceable in the Netherlands and makes clients take your terms seriously.

Set up your plumber invoice template once with all your standard details, and you can have a professional Dutch-compliant invoice sent within 2 minutes of finishing a job.

[Start with a free plumber invoice template at TradeInvoice](https://tradeinvoice.vercel.app) - built for tradespeople in the Netherlands and beyond.
`,
  },
  {
    slug: "plumbing-invoice-wording-examples",
    title: "Plumbing Invoice Wording: Exact Examples That Prevent Disputes",
    excerpt: "The right invoice wording for plumbing jobs stops disputes before they start. See real examples for emergency call-outs, renovations, and commercial work.",
    date: "2026-03-29",
    readTime: "5 min read",
    keyword: "plumbing invoice wording",
    metaDescription: "Real plumbing invoice wording examples for call-outs, boiler work, and renovations. Avoid payment disputes with clear, professional invoice descriptions.",
    content: `
## Why Invoice Wording Matters More Than the Price

Most invoice disputes are not really about money - they are about confusion. The client did not understand what they were paying for, did not expect a particular charge, or cannot reconcile the total with what they remember being told. Good plumbing invoice wording eliminates that confusion before it becomes a problem.

This is not about writing an essay on every invoice. It is about using the right words in the right place, every time.

## Invoice Wording Examples for Common Plumbing Jobs

### Emergency Call-Out

**Vague (causes disputes):**
> Emergency plumbing - £240

**Clear (no disputes):**
> Emergency call-out 07:45, 14 March. Burst pipe under kitchen sink at [address]. Isolated mains supply, cut and replaced 300mm section of 15mm copper pipe, tested for leaks, restored supply. Call-out fee: £80. Labour (1.5 hrs @ £65/hr): £97.50. Materials (copper pipe, compression fittings): £22.50. Total: £200 + VAT.

The key details: time, date, address, what was wrong, what you did, and how costs break down.

### Boiler Service

> Annual boiler service - Worcester Bosch 30i combi. Checked combustion analysis, flue integrity, heat exchanger, gas pressure, safety devices. Cleaned burner. All readings within manufacturer limits. Certificate issued. Labour (1 hr): €75. Replacement parts: nil. Total: €75 + BTW.

Notice this includes the boiler make and model - essential for warranty purposes and for any follow-up work.

### Bathroom Renovation

> Supply and installation of new shower enclosure and tray (Grohe Vitalio Start System). Works include: removal of existing shower, waterproofing substrate, installation of enclosure and waste trap, connection to existing hot/cold supplies and 40mm waste. 2 days labour @ €320/day: €640. Materials (see attached schedule): €485. Total excl. BTW: €1,125. BTW 9% on labour (renovatie woning): €57.60. BTW 21% on materials: €101.85. **Total incl. BTW: €1,284.45.**

This example uses the correct Dutch BTW split - 9% on labour for home renovation, 21% on materials.

### Drain Clearance

> High-pressure jetting of 4-inch soil stack, ground floor to manhole, [address]. Stack blocked due to scale build-up and wet wipes. Cleared and flow tested. CCTV survey not required. Labour (45 mins): £55. Call-out: £35. Total: £90 + VAT.

## Wording for Payment Terms and Late Fees

Your invoice wording should always include payment terms. Here are formulations that work:

**Standard residential (UK):**
> Payment due within 14 days of invoice date. Bank transfer to [sort code / account number] preferred. Please use invoice number as reference.

**Standard residential (Netherlands):**
> Betaling binnen 14 dagen na factuurdatum. Graag overmaken naar IBAN [NL XX XXXX XXXX XXXX XX] o.v.v. factuurnummer.

**Late payment clause (NL, legally enforceable):**
> Bij overschrijding van de betalingstermijn is de opdrachtgever van rechtswege in verzuim en is rente verschuldigd van 1% per maand, alsmede buitengerechtelijke incassokosten conform de Wet Incassokosten.

**Warranty statement:**
> All parts carry manufacturer warranty. Labour warranty: 12 months from date of completion for defects directly attributable to our workmanship.

## One Template, Every Job

The trick is not to write perfect wording from scratch every time - it is to build a template with your standard phrases pre-loaded, then fill in the job-specific details. Your call-out fee wording stays the same. Your BTW clause stays the same. Only the job description changes.

[Build your plumbing invoice template at TradeInvoice](https://tradeinvoice.vercel.app) - pre-fill your standard wording, customise per job, send in under 2 minutes.
`,
  },
  {
    slug: "dutch-invoice-template-free",
    title: "Free Dutch Invoice Template: What It Must Include to Be Legal",
    excerpt: "A free Dutch invoice template needs more than your name and a total. Here's exactly what the Belastingdienst requires, with a real example you can use today.",
    date: "2026-04-01",
    readTime: "6 min read",
    keyword: "dutch invoice template",
    metaDescription: "Download a free Dutch invoice template that meets all Belastingdienst requirements. KVK number, BTW-id, invoice numbering, and payment terms explained clearly.",
    content: `
## What Dutch Law Actually Requires on an Invoice

The Netherlands has some of the clearest invoicing rules in Europe. The Belastingdienst (Dutch Tax Authority) publishes a precise list of what every invoice must contain. A generic template from a random website may look professional but leave out legally required fields - which can cause problems during a BTW audit or when clients dispute charges.

Here is what a compliant Dutch invoice template must include:

### Mandatory Fields (No Exceptions)

**Seller's details:**
- Full name or registered business name (as listed with KVK)
- KVK number (your 8-digit Kamer van Koophandel registration)
- BTW-id (format: NL + 9 digits + B + 2 digits, e.g. NL123456789B01)
- Business address (the registered address, which may differ from where you work)

**Buyer's details:**
- Full name or company name
- Address
- For B2B invoices: buyer's VAT/BTW number

**Invoice details:**
- A unique, sequential invoice number. This is non-negotiable - the sequence must not have gaps. Use a consistent format: 2026-001, 2026-002, or FAC-2026-001.
- Invoice date (date of issue)
- Description of goods or services: specific enough that the Belastingdienst understands what was supplied. "Consulting March" fails this test. "Strategy consulting, 12 hours, relating to digital transformation roadmap for client ABC" passes.
- Quantity and unit price of each item
- BTW rate applicable (21%, 9%, or 0%)
- BTW amount in euros
- Subtotal excluding BTW
- Total including BTW

**Payment details:**
- Your IBAN
- Payment term (e.g. "Betaling binnen 30 dagen na factuurdatum")

### When You Are KOR-Exempt

If you are registered under the Kleineondernemersregeling (KOR) and exempt from charging BTW, you still issue invoices - but you must include the phrase: **"BTW vrijgesteld op grond van artikel 25 Wet OB 1968."** Do not show a BTW amount or rate. Do not show your BTW-id (you may not have one if you are KOR-registered and below the threshold).

## A Real Dutch Invoice Template Example

Here is what a compliant invoice looks like for a Dutch tradesperson:

---

**Loodgietersbedrijf De Vries**
Damrak 12, 1012 LG Amsterdam
KVK: 12345678 | BTW-id: NL123456789B01
Tel: 06-12345678 | info@devries-loodgieter.nl

---

**Factuur aan:**
Administratie B.V.
Herengracht 400
1017 BX Amsterdam
BTW: NL987654321B01

**Factuurnummer:** 2026-047
**Factuurdatum:** 1 april 2026
**Betalingstermijn:** 14 dagen (uiterlijk 15 april 2026)

---

| Omschrijving | Aantal | Stukprijs | Totaal |
|---|---|---|---|
| Arbeid: vervanging cv-pomp, 2 uur | 1 | €130,00 | €130,00 |
| Materiaal: Grundfos UPS2 pomp | 1 | €185,00 | €185,00 |
| Voorrijkosten | 1 | €25,00 | €25,00 |

Subtotaal excl. BTW: **€340,00**
BTW 21%: **€71,40**
**Totaal incl. BTW: €411,40**

Betaling o.v.v. factuurnummer 2026-047:
IBAN: NL12 ABNA 0123456789

---

## Common Mistakes to Avoid

**KVK vs BTW-id confusion:** Your KVK number (8 digits) and BTW-id are different things. Both must appear on every invoice if you are BTW-plichtig.

**Rounding errors:** Dutch invoices should show exact euro and cent amounts. Round at the total level, not per line item.

**Missing the buyer's VAT number on B2B invoices:** For transactions between two Dutch businesses, you need the buyer's BTW number on the invoice. For consumer (B2C) invoices, it is not required.

**Sending invoice images instead of PDFs:** A JPG of a handwritten invoice is not professional and makes record-keeping difficult for your client. Always send PDF.

## A Free Dutch Invoice Template That Does the Work For You

Rather than building your own Dutch invoice template from scratch, use a tool that pre-populates the required fields and handles BTW calculations automatically.

[Create your free Dutch invoice at TradeInvoice](https://tradeinvoice.vercel.app) - compliant with Belastingdienst requirements, sends as PDF, and takes under 2 minutes per invoice.
`,
  },
  {
    slug: "electrician-invoice-template-netherlands",
    title: "Electrician Invoice Template for the Netherlands: The Complete Guide",
    excerpt: "Everything a Dutch electrician needs to know about invoicing: BTW rates, KVK requirements, what to write in job descriptions, and how to get paid faster.",
    date: "2026-04-03",
    readTime: "7 min read",
    keyword: "electrician invoice template",
    metaDescription: "Create a compliant electrician invoice in the Netherlands. Learn BTW rates for electrical work, required fields, and get a free electrician invoice template today.",
    content: `
## Why Electrician Invoices Need Extra Care

Electrical work comes with a compliance layer that most other trades do not have. Certificates, inspection reports, NEN 1010 compliance declarations - these all tie back to your invoice as the commercial record of what was done. If your invoice description does not match your certificate, you have a problem.

Beyond compliance, electrical work often involves a mix of high-value materials (consumer units, EV chargers, solar components) and labour, at different BTW rates. Getting this right on your electrician invoice is both a legal requirement and a practical way to avoid client disputes.

## Dutch BTW Rates for Electrical Work

This is where many electricians make expensive mistakes:

**Labour on renovation work (bestaande woningen, older than 2 years):** 9% BTW applies to labour for renovation work on existing owner-occupied homes. This includes rewiring, adding circuits, fitting consumer units in existing homes.

**Labour on new-build or commercial work:** 21% BTW.

**Materials:** Always 21% BTW, regardless of the type of project.

**EV charging installations:** The reduced 9% rate on labour can apply if the charger is being installed in an existing private home. In commercial settings, it is 21%.

**Solar panel installations (zonnepanelen):** Since 2023, the BTW rate on solar panels supplied and installed on or near a residential home is 0%. This is a significant saving you can pass on to clients and a strong selling point.

The correct way to show this on your electrician invoice template is to list labour and materials as separate line items with their respective BTW rates. Do not blend them into a single total.

## What Your Electrician Invoice Must Include

As an electrician operating in the Netherlands, your invoice must meet Belastingdienst requirements:

**Your details:**
- Registered business name (as with KVK)
- KVK number
- BTW-id
- Business address

**Client details:**
- Name and address
- BTW number (for business clients)

**Job details:**
- Sequential invoice number
- Invoice date
- Specific description of work carried out
- Address where work was done
- Date(s) of work

**Financial details:**
- Line items with quantities and unit prices
- BTW rate per line (9% labour / 21% materials, or 0% for solar)
- Subtotal excl. BTW
- BTW amounts per rate
- Total incl. BTW
- Your IBAN and payment terms

## Writing Clear Job Descriptions

Electrical job descriptions need to be precise because they link to your safety certification. Compare:

**Too vague:**
> Electrical work, 2 days - €840 + BTW

**Correct:**
> Partial rewiring, first floor: replacement of ring main circuit serving 6 double sockets, installation of new 32A MCB in existing consumer unit (Hager). New cable in conduit, all connections made to BS 7671 / NEN 1010 standard. Test certificate issued. Labour (14 hrs): €560. Materials (2.5mm² T&E cable, conduit, MCB, sockets): €127.

For larger projects, attach a materials schedule as a PDF to avoid cramming 20 line items into the invoice body.

## An Electrician Invoice Example (Netherlands)

**Elektra Installaties Hendriks**
Industrieweg 5, 5611 AC Eindhoven
KVK: 23456789 | BTW-id: NL234567890B01

**Factuur aan:** Familie Bakker, Villapark 3, 5614 ER Eindhoven

**Factuurnummer:** 2026-112 | **Datum:** 3 april 2026

| Omschrijving | Bedrag excl. BTW |
|---|---|
| Arbeid: plaatsing laadpaal (Type 2, 11kW) incl. bekabeling 10m | €380,00 |
| Materiaal: Easee Home lader, kabeldoorvoer, bevestigingsmateriaal | €620,00 |

BTW 9% over arbeid (€380): **€34,20**
BTW 21% over materiaal (€620): **€130,20**
**Totaal incl. BTW: €1.164,40**

Betaling binnen 14 dagen: IBAN NL23 RABO 0234567890

## Protecting Yourself with Warranty Clauses

Add a brief warranty statement to every electrician invoice:

> "Garantie: 12 maanden op arbeid voor gebreken direct toe te schrijven aan onze werkzaamheden. Fabrieksgarantie op materialen conform leveranciersvoorwaarden."

This sets clear expectations and protects you from claims outside your reasonable responsibility.

[Set up your free electrician invoice template at TradeInvoice](https://tradeinvoice.vercel.app) - handles split BTW rates automatically, sends compliant PDF invoices in under 2 minutes.
`,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

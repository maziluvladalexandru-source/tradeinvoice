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

As a ZZP'er (zelfstandige zonder personeel) in the Netherlands, your invoice is not just a request for payment - it is a legal document. The Dutch tax authority (Belastingdienst) has specific rules about what must appear on every invoice you send. Get it wrong, and you could face fines or lose your right to deduct BTW.

But here is the good news: once you understand the basics, creating a compliant invoice takes less than a minute. This guide walks you through everything step by step.

## The Mandatory Fields on a Dutch ZZP Invoice

The Belastingdienst requires every invoice to include the following information:

### 1. Your Business Details

- **Full legal name** (or trade name registered with KVK)
- **Address** of your business
- **KVK number** (Kamer van Koophandel registration number)
- **BTW-id** (your VAT identification number, format: NL + 9 digits + B + 2 digits)

Your KVK number is the 8-digit number you received when you registered your business at the Chamber of Commerce. Your BTW-id is different - it is your tax identification number for VAT purposes.

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

BTW (Belasting over de Toegevoegde Waarde) is the Dutch version of VAT (Value Added Tax). If you are self-employed in the Netherlands, you almost certainly need to deal with BTW. This guide explains the rules in plain language - no accounting jargon, just what you actually need to know.

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

You opt in to the KOR by notifying the Belastingdienst. The registration takes effect from the start of a calendar quarter. Once you opt in, you must stay in the scheme for at least 3 years (unless your turnover exceeds the threshold).

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

Under Dutch law (and EU directive 2011/7/EU), business-to-business invoices must be paid within 30 days unless a different term is agreed in writing. For consumer invoices, the payment term stated on your invoice applies.

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

When you register your business at the Kamer van Koophandel (KVK), you take on certain legal obligations - including how you create and manage your invoices. The Netherlands has specific rules about what information must appear on business invoices, and the Belastingdienst (Dutch Tax Authority) enforces them.

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

**Where to find it:** On your KVK registration confirmation, or by searching the KVK register online at kvk.nl.

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
`,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export interface TradeLineItem {
  description: string;
  qty: string;
  rate: string;
  amount: string;
}

export interface TradeData {
  slug: string;
  name: string;
  namePlural: string;
  description: string;
  sampleLineItems: TradeLineItem[];
  commonServices: string[];
  pricingAdvice: {
    hourlyRange: string;
    perJobTips: string;
    materialsMarkup: string;
  };
  certifications: string[];
  keywords: string[];
  relatedBlogSlugs: string[];
}

export const trades: TradeData[] = [
  {
    slug: "plumber",
    name: "Plumber",
    namePlural: "Plumbers",
    description:
      "Professional invoice template designed for plumbers and plumbing contractors. Includes common line items like pipe repair, boiler servicing, and materials.",
    sampleLineItems: [
      { description: "Pipe repair - kitchen sink", qty: "2 hrs", rate: "\u20ac55.00", amount: "\u20ac110.00" },
      { description: "Boiler annual service", qty: "1", rate: "\u20ac120.00", amount: "\u20ac120.00" },
      { description: "Materials - copper fittings & valves", qty: "1", rate: "\u20ac48.50", amount: "\u20ac48.50" },
      { description: "Call-out fee (weekend)", qty: "1", rate: "\u20ac45.00", amount: "\u20ac45.00" },
    ],
    commonServices: [
      "Pipe repair and replacement",
      "Boiler installation and servicing",
      "Bathroom fitting",
      "Central heating installation",
      "Drain unblocking",
      "Water heater repair",
      "Leak detection and repair",
      "Radiator installation",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac45 - \u20ac75 per hour",
      perJobTips:
        "Emergency call-outs typically command a flat fee of \u20ac45-\u20ac75 on top of hourly rates. Boiler installations are usually quoted per job (\u20ac1,500-\u20ac3,000). Always separate labour from materials on your invoice.",
      materialsMarkup:
        "Standard markup on materials is 15-25%. Always list materials separately with clear descriptions so clients can see exactly what they are paying for.",
    },
    certifications: [
      "UNETO-VNI certification",
      "Gas Safe equivalent (NL: erkend installateur)",
      "Legionella prevention certification",
    ],
    keywords: [
      "plumber invoice template",
      "plumbing invoice",
      "invoice template plumber",
      "plumber invoice example",
      "free plumber invoice",
    ],
    relatedBlogSlugs: [
      "invoice-template-plumbers-guide",
      "plumber-hourly-rate-netherlands-2026",
      "kvk-invoice-requirements-dutch-freelancers",
    ],
  },
  {
    slug: "electrician",
    name: "Electrician",
    namePlural: "Electricians",
    description:
      "Professional invoice template for electricians. Covers rewiring, consumer unit upgrades, and electrical materials with proper line item breakdowns.",
    sampleLineItems: [
      { description: "Rewiring - kitchen circuit", qty: "4 hrs", rate: "\u20ac60.00", amount: "\u20ac240.00" },
      { description: "Consumer unit upgrade", qty: "1", rate: "\u20ac350.00", amount: "\u20ac350.00" },
      { description: "Materials - cables & sockets", qty: "1", rate: "\u20ac85.00", amount: "\u20ac85.00" },
      { description: "Electrical inspection & certificate", qty: "1", rate: "\u20ac75.00", amount: "\u20ac75.00" },
    ],
    commonServices: [
      "Full or partial rewiring",
      "Consumer unit (fuse box) upgrade",
      "Socket and switch installation",
      "Lighting installation",
      "Electrical inspection and testing",
      "EV charger installation",
      "Smart home wiring",
      "Fault finding and repair",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac50 - \u20ac80 per hour",
      perJobTips:
        "Consumer unit replacements are typically quoted as a fixed price (\u20ac350-\u20ac600). Full house rewires are per-job quotes based on property size. Always include a line item for testing and certification.",
      materialsMarkup:
        "Markup of 15-20% on cables, switches, and sockets is standard. High-value items like consumer units may carry a lower margin. Itemise everything clearly.",
    },
    certifications: [
      "NEN 1010 compliance",
      "Erkend installateur (registered installer)",
      "EV charging certification",
    ],
    keywords: [
      "electrician invoice template",
      "electrical invoice",
      "invoice template electrician",
      "electrician invoice example",
      "free electrician invoice",
    ],
    relatedBlogSlugs: [
      "electrician-invoice-template-guide",
      "kvk-invoice-requirements-dutch-freelancers",
      "btw-vat-rules-self-employed-netherlands-2026",
    ],
  },
  {
    slug: "builder",
    name: "Builder",
    namePlural: "Builders",
    description:
      "Invoice template for builders and construction contractors. Covers foundation work, brickwork, materials, and project-based billing.",
    sampleLineItems: [
      { description: "Foundation work - extension", qty: "8 hrs", rate: "\u20ac55.00", amount: "\u20ac440.00" },
      { description: "Brickwork - garden wall", qty: "6 hrs", rate: "\u20ac55.00", amount: "\u20ac330.00" },
      { description: "Materials - cement, blocks & sand", qty: "1", rate: "\u20ac195.00", amount: "\u20ac195.00" },
      { description: "Skip hire & waste disposal", qty: "1", rate: "\u20ac250.00", amount: "\u20ac250.00" },
    ],
    commonServices: [
      "Extensions and conversions",
      "Foundation and groundwork",
      "Brickwork and blockwork",
      "Plastering and rendering",
      "Demolition and site clearance",
      "Roofing and structural work",
      "Driveway and patio construction",
      "General renovation",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac45 - \u20ac65 per hour",
      perJobTips:
        "Most building work is quoted per project with milestone payments (e.g., 30% deposit, 40% at shell completion, 30% on handover). Break invoices into phases for larger jobs to maintain cash flow.",
      materialsMarkup:
        "Materials markup is typically 10-20%. For large orders (cement, timber), pass through at cost with a handling fee. Always get client approval for material costs over \u20ac500.",
    },
    certifications: [
      "VCA safety certification",
      "Bouwgarant or Woningborg warranty",
      "Asbestos awareness certification",
    ],
    keywords: [
      "builder invoice template",
      "construction invoice",
      "invoice template builder",
      "building contractor invoice",
      "free builder invoice",
    ],
    relatedBlogSlugs: [
      "kvk-invoice-requirements-dutch-freelancers",
      "chase-late-payments-without-losing-clients",
      "btw-vat-rules-self-employed-netherlands-2026",
    ],
  },
  {
    slug: "painter",
    name: "Painter & Decorator",
    namePlural: "Painters & Decorators",
    description:
      "Invoice template for painters and decorators. Includes interior and exterior painting, wallpapering, and preparation work line items.",
    sampleLineItems: [
      { description: "Interior painting - living room (walls & ceiling)", qty: "6 hrs", rate: "\u20ac45.00", amount: "\u20ac270.00" },
      { description: "Exterior woodwork - front of house", qty: "8 hrs", rate: "\u20ac45.00", amount: "\u20ac360.00" },
      { description: "Materials - paint, primer & filler", qty: "1", rate: "\u20ac120.00", amount: "\u20ac120.00" },
      { description: "Surface preparation & sanding", qty: "3 hrs", rate: "\u20ac40.00", amount: "\u20ac120.00" },
    ],
    commonServices: [
      "Interior wall and ceiling painting",
      "Exterior house painting",
      "Wallpapering and wallpaper removal",
      "Wood staining and varnishing",
      "Surface preparation and repair",
      "Spray painting",
      "Decorative finishes",
      "Commercial painting",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac35 - \u20ac55 per hour",
      perJobTips:
        "Most painters quote per room or per square metre for larger jobs. A standard room typically costs \u20ac250-\u20ac450 including materials. Exterior work is usually quoted per project after inspection.",
      materialsMarkup:
        "Paint markup of 15-20% is standard. Premium paints (Sikkens, Sigma) carry higher margins. Always specify paint brand and finish on the invoice for transparency.",
    },
    certifications: [
      "Schildersbedrijf certification",
      "Lead paint removal certification",
      "Working at height certification",
    ],
    keywords: [
      "painter invoice template",
      "decorator invoice",
      "painting invoice template",
      "painter decorator invoice",
      "free painter invoice",
    ],
    relatedBlogSlugs: [
      "kvk-invoice-requirements-dutch-freelancers",
      "chase-late-payments-without-losing-clients",
      "how-to-create-professional-invoice-zzp-netherlands",
    ],
  },
  {
    slug: "hvac",
    name: "HVAC Technician",
    namePlural: "HVAC Technicians",
    description:
      "Invoice template for HVAC technicians. Covers heating, ventilation, air conditioning installation and maintenance with proper service line items.",
    sampleLineItems: [
      { description: "Air conditioning unit installation", qty: "1", rate: "\u20ac450.00", amount: "\u20ac450.00" },
      { description: "Heating system annual maintenance", qty: "1", rate: "\u20ac150.00", amount: "\u20ac150.00" },
      { description: "Materials - refrigerant, filters & ducting", qty: "1", rate: "\u20ac135.00", amount: "\u20ac135.00" },
      { description: "Ductwork inspection & cleaning", qty: "3 hrs", rate: "\u20ac65.00", amount: "\u20ac195.00" },
    ],
    commonServices: [
      "Air conditioning installation",
      "Heat pump installation",
      "Central heating maintenance",
      "Ventilation system installation",
      "Ductwork installation and repair",
      "Thermostat installation",
      "Refrigerant recharge",
      "Indoor air quality testing",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac55 - \u20ac85 per hour",
      perJobTips:
        "HVAC installations are typically quoted per project (\u20ac2,000-\u20ac8,000 depending on system type). Maintenance contracts are billed annually or semi-annually. Emergency repairs command premium rates.",
      materialsMarkup:
        "Equipment markup is typically 10-15% for large units (heat pumps, AC units). Consumables like filters and refrigerant can carry 20-30% markup. Always list model numbers on invoices.",
    },
    certifications: [
      "F-gas certification",
      "STEK certification (refrigerant handling)",
      "Erkend warmtepomp installateur",
    ],
    keywords: [
      "hvac invoice template",
      "heating invoice",
      "air conditioning invoice template",
      "hvac technician invoice",
      "free hvac invoice",
    ],
    relatedBlogSlugs: [
      "kvk-invoice-requirements-dutch-freelancers",
      "btw-vat-rules-self-employed-netherlands-2026",
      "chase-late-payments-without-losing-clients",
    ],
  },
  {
    slug: "carpenter",
    name: "Carpenter",
    namePlural: "Carpenters",
    description:
      "Invoice template for carpenters and woodworkers. Includes kitchen fitting, custom furniture, and timber materials with detailed breakdowns.",
    sampleLineItems: [
      { description: "Kitchen cabinet installation", qty: "6 hrs", rate: "\u20ac55.00", amount: "\u20ac330.00" },
      { description: "Custom shelving unit - oak", qty: "1", rate: "\u20ac480.00", amount: "\u20ac480.00" },
      { description: "Materials - timber, screws & adhesive", qty: "1", rate: "\u20ac165.00", amount: "\u20ac165.00" },
      { description: "Door hanging and adjustment", qty: "2 hrs", rate: "\u20ac50.00", amount: "\u20ac100.00" },
    ],
    commonServices: [
      "Kitchen fitting and installation",
      "Custom furniture making",
      "Door hanging and fitting",
      "Shelving and storage solutions",
      "Flooring installation",
      "Window frame repair",
      "Staircase construction",
      "Timber frame building",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac45 - \u20ac70 per hour",
      perJobTips:
        "Custom furniture is best quoted per piece with detailed specifications. Kitchen fitting is usually per-project (\u20ac800-\u20ac2,500 for labour). Always include a design/measurement visit as a separate line item.",
      materialsMarkup:
        "Timber markup of 15-20% is standard. Specialist hardwoods and hardware may carry higher margins. Provide material specifications (wood type, grade) on the invoice.",
    },
    certifications: [
      "Vakman timmerman certification",
      "NEN safety standards compliance",
      "FSC-certified wood handling",
    ],
    keywords: [
      "carpenter invoice template",
      "carpentry invoice",
      "woodworker invoice template",
      "carpenter invoice example",
      "free carpenter invoice",
    ],
    relatedBlogSlugs: [
      "kvk-invoice-requirements-dutch-freelancers",
      "how-to-create-professional-invoice-zzp-netherlands",
      "chase-late-payments-without-losing-clients",
    ],
  },
  {
    slug: "landscaper",
    name: "Landscaper & Gardener",
    namePlural: "Landscapers & Gardeners",
    description:
      "Invoice template for landscapers and gardeners. Covers garden design, lawn care, planting, and hardscaping with seasonal service breakdowns.",
    sampleLineItems: [
      { description: "Garden redesign - planting & layout", qty: "8 hrs", rate: "\u20ac45.00", amount: "\u20ac360.00" },
      { description: "Patio laying - 20m\u00b2 porcelain tiles", qty: "1", rate: "\u20ac650.00", amount: "\u20ac650.00" },
      { description: "Materials - plants, soil & gravel", qty: "1", rate: "\u20ac280.00", amount: "\u20ac280.00" },
      { description: "Hedge trimming & garden clearance", qty: "4 hrs", rate: "\u20ac40.00", amount: "\u20ac160.00" },
    ],
    commonServices: [
      "Garden design and landscaping",
      "Lawn laying and maintenance",
      "Patio and decking installation",
      "Hedge trimming and tree pruning",
      "Planting and bed creation",
      "Fencing installation",
      "Irrigation system installation",
      "Garden clearance and waste removal",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac35 - \u20ac55 per hour",
      perJobTips:
        "Regular maintenance is best sold as monthly contracts (\u20ac150-\u20ac400/month). Landscaping projects are quoted per job after site visit. Seasonal work (spring cleanup, autumn leaf clearing) can be packaged as seasonal deals.",
      materialsMarkup:
        "Plant and materials markup of 20-30% is common. Bulk materials (gravel, soil) are often passed through at cost plus delivery. Always photograph the completed work for your records.",
    },
    certifications: [
      "Hovenier certification",
      "Pesticide application licence",
      "Tree surgery certification (ETW)",
    ],
    keywords: [
      "landscaper invoice template",
      "gardening invoice",
      "garden maintenance invoice",
      "landscaping invoice template",
      "free landscaper invoice",
    ],
    relatedBlogSlugs: [
      "how-to-create-professional-invoice-zzp-netherlands",
      "kvk-invoice-requirements-dutch-freelancers",
      "chase-late-payments-without-losing-clients",
    ],
  },
  {
    slug: "roofer",
    name: "Roofer",
    namePlural: "Roofers",
    description:
      "Invoice template for roofers and roofing contractors. Includes roof repairs, replacements, gutter work, and roofing materials.",
    sampleLineItems: [
      { description: "Flat roof repair - EPDM membrane", qty: "1", rate: "\u20ac380.00", amount: "\u20ac380.00" },
      { description: "Tile replacement - 15 broken tiles", qty: "3 hrs", rate: "\u20ac55.00", amount: "\u20ac165.00" },
      { description: "Materials - tiles, membrane & sealant", qty: "1", rate: "\u20ac220.00", amount: "\u20ac220.00" },
      { description: "Gutter cleaning and repair", qty: "2 hrs", rate: "\u20ac50.00", amount: "\u20ac100.00" },
    ],
    commonServices: [
      "Roof repair and maintenance",
      "Full roof replacement",
      "Flat roof installation (EPDM/bitumen)",
      "Tile and slate replacement",
      "Gutter installation and repair",
      "Chimney flashing repair",
      "Roof insulation",
      "Skylight installation",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac50 - \u20ac75 per hour",
      perJobTips:
        "Most roofing work is quoted per project after inspection. Small repairs (\u20ac200-\u20ac500), partial re-roofing (\u20ac2,000-\u20ac5,000), full replacement (\u20ac8,000-\u20ac20,000+). Include scaffolding as a separate line item.",
      materialsMarkup:
        "Roofing materials markup of 10-15% for large orders. Specialist materials (EPDM, lead flashing) may carry 15-20%. Always specify material type and warranty details.",
    },
    certifications: [
      "Dakvakman certification",
      "VCA safety certificate",
      "Working at height certification",
    ],
    keywords: [
      "roofer invoice template",
      "roofing invoice",
      "roof repair invoice template",
      "roofer invoice example",
      "free roofer invoice",
    ],
    relatedBlogSlugs: [
      "kvk-invoice-requirements-dutch-freelancers",
      "chase-late-payments-without-losing-clients",
      "btw-vat-rules-self-employed-netherlands-2026",
    ],
  },
  {
    slug: "tiler",
    name: "Tiler",
    namePlural: "Tilers",
    description:
      "Invoice template for tilers and tile fitters. Covers bathroom tiling, kitchen splashbacks, floor tiling, and materials with per-metre pricing.",
    sampleLineItems: [
      { description: "Bathroom wall tiling - 12m\u00b2", qty: "1", rate: "\u20ac420.00", amount: "\u20ac420.00" },
      { description: "Kitchen splashback - mosaic tiles", qty: "4 hrs", rate: "\u20ac55.00", amount: "\u20ac220.00" },
      { description: "Materials - tiles, adhesive & grout", qty: "1", rate: "\u20ac175.00", amount: "\u20ac175.00" },
      { description: "Floor preparation & levelling", qty: "3 hrs", rate: "\u20ac50.00", amount: "\u20ac150.00" },
    ],
    commonServices: [
      "Bathroom wall and floor tiling",
      "Kitchen splashback tiling",
      "Floor tiling (ceramic, porcelain, natural stone)",
      "Wet room installation",
      "Outdoor patio tiling",
      "Tile removal and disposal",
      "Floor levelling and preparation",
      "Mosaic and decorative tiling",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac45 - \u20ac65 per hour",
      perJobTips:
        "Many tilers charge per square metre (\u20ac30-\u20ac55/m\u00b2 for standard tiling, \u20ac55-\u20ac85/m\u00b2 for complex patterns). Bathroom tiling is often quoted as a complete project. Always include floor preparation as a separate line item.",
      materialsMarkup:
        "Tile supply markup of 15-20% if you source tiles for the client. Adhesive and grout markup of 20-25%. Clearly list tile specifications (size, brand, finish) on the invoice.",
    },
    certifications: [
      "Tegelzetter vakdiploma",
      "Waterproofing certification",
      "Natural stone installation certification",
    ],
    keywords: [
      "tiler invoice template",
      "tiling invoice",
      "tile fitter invoice template",
      "tiler invoice example",
      "free tiler invoice",
    ],
    relatedBlogSlugs: [
      "kvk-invoice-requirements-dutch-freelancers",
      "how-to-create-professional-invoice-zzp-netherlands",
      "chase-late-payments-without-losing-clients",
    ],
  },
  {
    slug: "handyman",
    name: "Handyman",
    namePlural: "Handymen",
    description:
      "Invoice template for handymen and general maintenance professionals. Covers a wide range of small repairs, installations, and odd jobs.",
    sampleLineItems: [
      { description: "Furniture assembly - 2 wardrobes", qty: "3 hrs", rate: "\u20ac40.00", amount: "\u20ac120.00" },
      { description: "Shelf mounting & TV bracket install", qty: "2 hrs", rate: "\u20ac40.00", amount: "\u20ac80.00" },
      { description: "Materials - brackets, screws & anchors", qty: "1", rate: "\u20ac25.00", amount: "\u20ac25.00" },
      { description: "Door lock replacement", qty: "1 hr", rate: "\u20ac40.00", amount: "\u20ac40.00" },
    ],
    commonServices: [
      "Furniture assembly",
      "Shelving and mounting",
      "Minor plumbing repairs",
      "Basic electrical fixes",
      "Door and window repairs",
      "Painting touch-ups",
      "Kitchen and bathroom caulking",
      "General property maintenance",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac30 - \u20ac50 per hour",
      perJobTips:
        "Many handymen charge a minimum call-out fee (\u20ac50-\u20ac75) plus hourly rate. Bundling multiple small jobs into one visit increases your average ticket. Offer half-day (\u20ac150-\u20ac200) or full-day rates (\u20ac280-\u20ac380) for larger job lists.",
      materialsMarkup:
        "Small materials (screws, brackets, sealant) can be bundled into a flat materials fee (\u20ac15-\u20ac30). For larger purchases, add 15-20% markup and itemise separately.",
    },
    certifications: [
      "General maintenance certification",
      "Basic electrical safety training",
      "Working at height awareness",
    ],
    keywords: [
      "handyman invoice template",
      "handyman invoice",
      "maintenance invoice template",
      "handyman invoice example",
      "free handyman invoice",
    ],
    relatedBlogSlugs: [
      "how-to-create-professional-invoice-zzp-netherlands",
      "kvk-invoice-requirements-dutch-freelancers",
      "chase-late-payments-without-losing-clients",
    ],
  },
  {
    slug: "welder",
    name: "Welder",
    namePlural: "Welders",
    description:
      "Invoice template for welders and metal fabricators. Covers structural welding, repairs, custom fabrication, and welding materials.",
    sampleLineItems: [
      { description: "Steel gate fabrication & installation", qty: "1", rate: "\u20ac650.00", amount: "\u20ac650.00" },
      { description: "Structural welding repair - balcony railing", qty: "4 hrs", rate: "\u20ac65.00", amount: "\u20ac260.00" },
      { description: "Materials - steel, welding rods & gas", qty: "1", rate: "\u20ac145.00", amount: "\u20ac145.00" },
      { description: "Mobile welding rig transport", qty: "1", rate: "\u20ac50.00", amount: "\u20ac50.00" },
    ],
    commonServices: [
      "Structural welding and repair",
      "Custom metal fabrication",
      "Gate and railing fabrication",
      "Stainless steel welding",
      "Aluminium welding (TIG/MIG)",
      "On-site mobile welding",
      "Industrial equipment repair",
      "Ornamental metalwork",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac55 - \u20ac85 per hour",
      perJobTips:
        "Custom fabrication is quoted per project after design review. Simple repairs can be hourly. Mobile welding typically adds a transport fee (\u20ac40-\u20ac75). Specialist welding (stainless, aluminium) commands premium rates.",
      materialsMarkup:
        "Steel and metal markup of 15-20%. Welding consumables (rods, wire, gas) carry 20-25% markup. Always specify steel grade and thickness on invoices for traceability.",
    },
    certifications: [
      "EN ISO 9606 welder certification",
      "VCA safety certificate",
      "NEN-EN 1090 structural welding",
    ],
    keywords: [
      "welder invoice template",
      "welding invoice",
      "metal fabrication invoice",
      "welder invoice example",
      "free welder invoice",
    ],
    relatedBlogSlugs: [
      "kvk-invoice-requirements-dutch-freelancers",
      "btw-vat-rules-self-employed-netherlands-2026",
      "chase-late-payments-without-losing-clients",
    ],
  },
  {
    slug: "locksmith",
    name: "Locksmith",
    namePlural: "Locksmiths",
    description:
      "Invoice template for locksmiths and security specialists. Covers lock replacement, emergency access, and security system installations.",
    sampleLineItems: [
      { description: "Emergency lockout - door opening", qty: "1", rate: "\u20ac95.00", amount: "\u20ac95.00" },
      { description: "Lock replacement - 3-point security lock", qty: "1", rate: "\u20ac85.00", amount: "\u20ac85.00" },
      { description: "Materials - cylinder lock & keys (x4)", qty: "1", rate: "\u20ac65.00", amount: "\u20ac65.00" },
      { description: "Security survey & recommendation", qty: "1 hr", rate: "\u20ac50.00", amount: "\u20ac50.00" },
    ],
    commonServices: [
      "Emergency lockout service",
      "Lock replacement and rekeying",
      "Security lock upgrades",
      "Key cutting and duplication",
      "Safe opening and repair",
      "Access control systems",
      "CCTV installation",
      "Window lock installation",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac50 - \u20ac80 per hour",
      perJobTips:
        "Emergency call-outs are typically flat-rate (\u20ac75-\u20ac150 depending on time of day). Lock replacements are per-lock plus materials. After-hours and weekend rates are usually 50-100% premium. Always provide a written quote before starting work.",
      materialsMarkup:
        "Lock and cylinder markup of 20-30%. High-security locks (SKG-rated) carry premium pricing. Always specify the security rating (SKG*, SKG**, SKG***) on the invoice.",
    },
    certifications: [
      "VEB/BORG locksmith certification",
      "SKG-certified installer",
      "Politiekeurmerk Veilig Wonen (PKVW)",
    ],
    keywords: [
      "locksmith invoice template",
      "locksmith invoice",
      "security invoice template",
      "locksmith invoice example",
      "free locksmith invoice",
    ],
    relatedBlogSlugs: [
      "kvk-invoice-requirements-dutch-freelancers",
      "how-to-create-professional-invoice-zzp-netherlands",
      "chase-late-payments-without-losing-clients",
    ],
  },
  {
    slug: "cleaner",
    name: "Cleaning Company",
    namePlural: "Cleaning Companies",
    description:
      "Invoice template for cleaning companies and professional cleaners. Covers regular cleaning, deep cleaning, end-of-tenancy, and commercial cleaning services.",
    sampleLineItems: [
      { description: "Deep clean - 3-bedroom apartment", qty: "1", rate: "\u20ac280.00", amount: "\u20ac280.00" },
      { description: "Regular weekly cleaning (4 visits)", qty: "4", rate: "\u20ac75.00", amount: "\u20ac300.00" },
      { description: "Materials - cleaning products & supplies", qty: "1", rate: "\u20ac35.00", amount: "\u20ac35.00" },
      { description: "Window cleaning - interior & exterior", qty: "3 hrs", rate: "\u20ac40.00", amount: "\u20ac120.00" },
    ],
    commonServices: [
      "Regular domestic cleaning",
      "Deep cleaning",
      "End-of-tenancy cleaning",
      "Office and commercial cleaning",
      "Window cleaning",
      "Carpet and upholstery cleaning",
      "Post-construction cleaning",
      "Airbnb turnover cleaning",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac25 - \u20ac45 per hour",
      perJobTips:
        "Regular cleaning is typically sold as weekly or bi-weekly contracts (\u20ac60-\u20ac120 per visit for a standard home). Deep cleans are per-job (\u20ac200-\u20ac500). End-of-tenancy cleaning is per-property based on size. Volume contracts with offices or Airbnb hosts provide steady income.",
      materialsMarkup:
        "Cleaning supplies are usually included in the price or charged as a flat fee (\u20ac10-\u20ac25 per visit). Specialist products (carpet cleaner, descaler) can be itemised separately with 20-30% markup.",
    },
    certifications: [
      "Schoonmaak vakdiploma",
      "OSB quality mark",
      "ISSA certification",
    ],
    keywords: [
      "cleaning invoice template",
      "cleaner invoice",
      "cleaning company invoice",
      "cleaning service invoice template",
      "free cleaning invoice",
    ],
    relatedBlogSlugs: [
      "how-to-create-professional-invoice-zzp-netherlands",
      "kvk-invoice-requirements-dutch-freelancers",
      "chase-late-payments-without-losing-clients",
    ],
  },
  {
    slug: "mechanic",
    name: "Auto Mechanic",
    namePlural: "Auto Mechanics",
    description:
      "Invoice template for auto mechanics and garage workshops. Covers car repairs, servicing, MOT preparation, and parts with labour hour breakdowns.",
    sampleLineItems: [
      { description: "Full service - oil, filters & fluids", qty: "1", rate: "\u20ac180.00", amount: "\u20ac180.00" },
      { description: "Brake pad replacement (front axle)", qty: "2 hrs", rate: "\u20ac60.00", amount: "\u20ac120.00" },
      { description: "Parts - brake pads, oil filter & engine oil", qty: "1", rate: "\u20ac95.00", amount: "\u20ac95.00" },
      { description: "APK (MOT) inspection", qty: "1", rate: "\u20ac35.00", amount: "\u20ac35.00" },
    ],
    commonServices: [
      "Full vehicle servicing",
      "Brake repair and replacement",
      "Engine diagnostics",
      "APK (MOT) inspection",
      "Timing belt replacement",
      "Exhaust system repair",
      "Tyre fitting and balancing",
      "Air conditioning recharge",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac50 - \u20ac75 per hour",
      perJobTips:
        "Standard services are often fixed-price (\u20ac150-\u20ac250 for a full service). APK inspections have a regulated maximum fee. Complex diagnostics should be charged separately from repair work. Always separate labour from parts on the invoice.",
      materialsMarkup:
        "Parts markup of 20-35% is standard in the industry. OEM parts carry lower margins than aftermarket. Always list part numbers and whether parts are OEM, OE-quality, or aftermarket on the invoice.",
    },
    certifications: [
      "APK inspection certification",
      "Innovam technical certifications",
      "RDW recognised workshop",
    ],
    keywords: [
      "mechanic invoice template",
      "garage invoice",
      "auto repair invoice template",
      "car mechanic invoice",
      "free mechanic invoice",
    ],
    relatedBlogSlugs: [
      "kvk-invoice-requirements-dutch-freelancers",
      "btw-vat-rules-self-employed-netherlands-2026",
      "chase-late-payments-without-losing-clients",
    ],
  },
  {
    slug: "zzp",
    name: "ZZP'er",
    namePlural: "ZZP'ers",
    description:
      "Factuur template speciaal voor ZZP'ers in Nederland. Inclusief alle wettelijke vereisten: KVK-nummer, BTW-id, IBAN en correcte factuurnummering.",
    sampleLineItems: [
      { description: "Consultancy diensten - projectadvies", qty: "8 uur", rate: "\u20ac75,00", amount: "\u20ac600,00" },
      { description: "Werkzaamheden - implementatie", qty: "16 uur", rate: "\u20ac65,00", amount: "\u20ac1.040,00" },
      { description: "Reiskosten", qty: "1", rate: "\u20ac45,00", amount: "\u20ac45,00" },
      { description: "Materialen en licenties", qty: "1", rate: "\u20ac120,00", amount: "\u20ac120,00" },
    ],
    commonServices: [
      "Consultancy en advies",
      "Projectmanagement",
      "Technische dienstverlening",
      "Ontwerp en creatief werk",
      "Marketing en communicatie",
      "IT-ondersteuning",
      "Training en coaching",
      "Administratieve ondersteuning",
    ],
    pricingAdvice: {
      hourlyRange: "\u20ac50 - \u20ac150 per uur (afhankelijk van specialisatie)",
      perJobTips:
        "Als ZZP'er kun je per uur, per dag of per project factureren. Dagtarieven liggen doorgaans tussen \u20ac400 en \u20ac1.200. Zorg altijd voor duidelijke afspraken vooraf en leg deze vast in een opdrachtbevestiging.",
      materialsMarkup:
        "Onkosten zoals reiskosten, materialen en softwarelicenties worden doorgaans tegen kostprijs plus 10-15% doorberekend. Zorg dat je een duidelijke specificatie opneemt.",
    },
    certifications: [
      "KVK-inschrijving",
      "VAR/modelovereenkomst (Wet DBA)",
      "Branchespecifieke certificeringen",
    ],
    keywords: [
      "zzp factuur template",
      "factuur template zzp",
      "zzp factuur voorbeeld",
      "gratis factuur template",
      "factuur maken zzp",
    ],
    relatedBlogSlugs: [
      "how-to-create-professional-invoice-zzp-netherlands",
      "zzp-invoice-template-free-guide",
      "kvk-invoice-requirements-dutch-freelancers",
    ],
  },
];

export function getTradeBySlug(slug: string): TradeData | undefined {
  return trades.find((t) => t.slug === slug);
}

export interface CountryData {
  slug: string;
  name: string;
  nameLocal: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  vatRate: number;
  vatName: string;
  registrationName: string;
  registrationBody: string;
  taxAuthority: string;
  taxAuthorityUrl: string;
  legalRequirements: string[];
  paymentTerms: string;
  locale: string;
}

export const countries: CountryData[] = [
  {
    slug: "netherlands",
    name: "Netherlands",
    nameLocal: "Nederland",
    flag: "\ud83c\uddf3\ud83c\uddf1",
    currency: "EUR",
    currencySymbol: "\u20ac",
    vatRate: 21,
    vatName: "BTW",
    registrationName: "KVK",
    registrationBody: "Kamer van Koophandel",
    taxAuthority: "Belastingdienst",
    taxAuthorityUrl: "https://www.belastingdienst.nl",
    legalRequirements: [
      "KVK number",
      "BTW-id",
      "IBAN",
      "Business address",
      "Invoice date",
      "Sequential invoice number",
      "Description of services",
    ],
    paymentTerms:
      "Net 30 is standard in the Netherlands. For B2B, you can charge statutory interest (wettelijke handelsrente) after the due date.",
    locale: "nl",
  },
  {
    slug: "uk",
    name: "United Kingdom",
    nameLocal: "UK",
    flag: "\ud83c\uddec\ud83c\udde7",
    currency: "GBP",
    currencySymbol: "\u00a3",
    vatRate: 20,
    vatName: "VAT",
    registrationName: "Companies House",
    registrationBody: "Companies House",
    taxAuthority: "HMRC",
    taxAuthorityUrl:
      "https://www.gov.uk/government/organisations/hm-revenue-customs",
    legalRequirements: [
      "Company name",
      "Company number",
      "VAT number (if registered)",
      "Registered address",
      "Invoice date",
      "Unique invoice number",
      "Description of goods/services",
    ],
    paymentTerms:
      "Net 30 is standard in the UK. Under the Late Payment of Commercial Debts Act, you can charge interest at 8% + Bank of England base rate.",
    locale: "en",
  },
  {
    slug: "germany",
    name: "Germany",
    nameLocal: "Deutschland",
    flag: "\ud83c\udde9\ud83c\uddea",
    currency: "EUR",
    currencySymbol: "\u20ac",
    vatRate: 19,
    vatName: "MwSt/USt",
    registrationName: "Handelsregister",
    registrationBody: "Handelsregister",
    taxAuthority: "Finanzamt",
    taxAuthorityUrl: "https://www.bzst.de",
    legalRequirements: [
      "Company name and address",
      "Tax number (Steuernummer)",
      "USt-IdNr (if applicable)",
      "Invoice date",
      "Sequential invoice number",
      "Description with quantity and price",
      "Net amount, tax rate, tax amount, gross amount separately",
    ],
    paymentTerms:
      "Net 30 is common. Under German law (BGB \u00a7286), interest can be charged at 9% above ECB base rate for B2B transactions after the due date.",
    locale: "de",
  },
];

export function getCountryBySlug(slug: string): CountryData | undefined {
  return countries.find((c) => c.slug === slug);
}

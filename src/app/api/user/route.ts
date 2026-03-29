import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser();

    if (rateLimit("user-settings", user.id, 30, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
    }

    const {
      name, businessName, businessAddress, businessPhone, kvkNumber, vatNumber, bankDetails, logoUrl,
      defaultPaymentTerms, defaultTaxRate, defaultCurrency, defaultCountry, defaultLanguage, invoiceNumberPrefix,
      notifyOnView, notifyOnPay, notifyReminders,
    } = await req.json();

    // Validate logoUrl: must be base64 image or empty, max 500KB
    let validatedLogoUrl: string | null | undefined = undefined;
    if (logoUrl !== undefined) {
      if (!logoUrl) {
        validatedLogoUrl = null;
      } else if (typeof logoUrl === "string" && logoUrl.startsWith("data:image/") && logoUrl.length <= 500 * 1024) {
        validatedLogoUrl = logoUrl;
      } else {
        return NextResponse.json(
          { error: "Logo must be a base64 image (data:image/...) under 500KB" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name ? sanitizeString(name, 200) : null,
        businessName: businessName ? sanitizeString(businessName, 200) : null,
        businessAddress: businessAddress ? sanitizeString(businessAddress, 500) : null,
        businessPhone: businessPhone ? sanitizeString(businessPhone, 30) : null,
        kvkNumber: kvkNumber ? sanitizeString(kvkNumber, 50) : null,
        vatNumber: vatNumber ? sanitizeString(vatNumber, 50) : null,
        bankDetails: bankDetails ? sanitizeString(bankDetails, 1000) : null,
        ...(validatedLogoUrl !== undefined ? { logoUrl: validatedLogoUrl } : {}),
        ...(defaultPaymentTerms !== undefined ? { defaultPaymentTerms: sanitizeString(defaultPaymentTerms, 20) } : {}),
        ...(defaultTaxRate !== undefined ? { defaultTaxRate: typeof defaultTaxRate === "number" ? defaultTaxRate : null } : {}),
        ...(defaultCurrency !== undefined ? { defaultCurrency: sanitizeString(defaultCurrency, 10) } : {}),
        ...(defaultCountry !== undefined ? { defaultCountry: sanitizeString(defaultCountry, 10) } : {}),
        ...(defaultLanguage !== undefined ? { defaultLanguage: sanitizeString(defaultLanguage, 10) } : {}),
        ...(invoiceNumberPrefix !== undefined ? { invoiceNumberPrefix: invoiceNumberPrefix ? sanitizeString(invoiceNumberPrefix, 20) : null } : {}),
        ...(notifyOnView !== undefined ? { notifyOnView: !!notifyOnView } : {}),
        ...(notifyOnPay !== undefined ? { notifyOnPay: !!notifyOnPay } : {}),
        ...(notifyReminders !== undefined ? { notifyReminders: !!notifyReminders } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

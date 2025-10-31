console.log("MAILBOXLAYER_API_KEY:", process.env.MAILBOXLAYER_API_KEY);

import { NextResponse } from "next/server";

// for MailboxLayer API
const API_KEY = process.env.MAILBOXLAYER_API_KEY || "YOUR_FREE_TIER_KEY";
const API_ENDPOINT = "https://apilayer.net/api/check";

// POST endpoint for verifying email
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { storekeyvaluepair: false, message: "❌ Invalid email format." },
        { status: 400 }
      );
    }

    // here Calling MailboxLayer API for email check
    const verifyUrl = `${API_ENDPOINT}?access_key=${API_KEY}&email=${encodeURIComponent(
      email
    )}&smtp=1&format=1`;

    const response = await fetch(verifyUrl);
    const data = await response.json();

    // Handle possible API errors (invalid key, rate limit, etc.)
    if (data.success === false) {
      return NextResponse.json(
        {
          storekeyvaluepair: false,
          message: ` API Error: ${data.error?.info || "Invalid request or API key."}`,
        },
        { status: 400 }
      );
    }

    // 4️⃣ Check deliverability — main fields from MailboxLayer
    const isDeliverable =
      data.format_valid === true &&
      data.mx_found === true &&
      data.smtp_check === true;

    if (isDeliverable) {
      return NextResponse.json(
        {
          storekeyvaluepair: true,
          message: "✅ Email exists and is deliverable. You can proceed.",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          storekeyvaluepair: false,
          message:
            "Email not deliverable or mailbox not found. Please use a valid existing email.",
          details: {
            format_valid: data.format_valid,
            smtp_check: data.smtp_check,
            mx_found: data.mx_found,
          },
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        storekeyvaluepair: false,
        message: " Internal error verifying email. Please try again later.",
      },
      { status: 500 }
    );
  }
}

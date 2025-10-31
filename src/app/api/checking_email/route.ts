import { NextResponse } from "next/server";
// pre defined emails here
const registeredEmails = ["sourav@gmail.com", "codestam@gmail.com"];

// async function for post request
export async function POST(req: Request) {
  const { email } = await req.json();
//  store request body
  const storekeyvaluepair = registeredEmails.includes(email);

  return NextResponse.json({ storekeyvaluepair });
}

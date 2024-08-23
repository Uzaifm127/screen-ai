import { sendEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const { userDetails } = await req.json();

    const subject = `${userDetails.name} passes the test.`;
    const html = `<h1>here are the details of the candidate:</h1>
        <p>Name: ${userDetails.name}</p>
        <p>Email: ${userDetails.email}</p>
        <p>Phone: ${userDetails.phone}</p>
        <p>LinkedIn profile: ${userDetails?.linkedInProfile || "NA"}</p>
        `;

    await sendEmail(userDetails.email, subject, html);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

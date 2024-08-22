import { sendEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const { userDetails, selected } = await req.json();

    const html = selected
      ? "<h1>Congratulation! You passed the test in a right way.</h1><br /><br />The HR will contact you shortly."
      : "<h1>You are not eligible for the position now. Best of luck for the furture.</h1>";

    const subject = `Regarding the HR test application for ${userDetails.name}`;

    sendEmail(userDetails.email, subject, html);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

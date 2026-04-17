import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "Ryan_Z_Resume.pdf");

  try {
    const file = await readFile(filePath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Ryan_Zhang_Resume.pdf"',
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Resume not found" },
      { status: 404 }
    );
  }
}

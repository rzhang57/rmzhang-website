import { NextResponse } from "next/server";
import { getContent } from "@/lib/content/store";

export async function GET() {
  return NextResponse.json(await getContent());
}

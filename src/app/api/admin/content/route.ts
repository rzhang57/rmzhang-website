import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/admin/auth";
import { checkShape } from "@/lib/content/shape";
import {
  contentShape,
  getContent,
  saveContent,
  saveSnapshot,
} from "@/lib/content/store";

export async function GET() {
  return NextResponse.json(await getContent());
}

export async function PUT(request: NextRequest) {
  if (!(await verifySession(request.cookies.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // a cross-site form or fetch can carry the cookie under sameSite lax, so the
  // write itself refuses anything that did not come from this origin.
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "bad origin" }, { status: 403 });
  }

  try {
    const content = await request.json();

    // checked before the storage guard so a misconfigured store still returns
    // useful field errors.
    const problems = checkShape(content, contentShape());
    if (problems.length > 0) {
      return NextResponse.json(
        { error: "content no longer matches the committed shape", problems },
        { status: 422 }
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN is not configured" },
        { status: 503 }
      );
    }

    await saveContent(content);
    await saveSnapshot(content);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin] save failed", error);
    return NextResponse.json({ error: "save failed" }, { status: 500 });
  }
}

import { contentShape, getContent } from "@/lib/content/store";
import Editor from "./Editor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  return <Editor initial={await getContent()} shape={contentShape()} />;
}

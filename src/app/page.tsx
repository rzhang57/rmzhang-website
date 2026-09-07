import App from "../components/App";
import { ContentProvider } from "@/lib/content/provider";
import { getContent } from "@/lib/content/store";

export default async function Home() {
  return (
    <ContentProvider content={await getContent()}>
      <App />
    </ContentProvider>
  );
}

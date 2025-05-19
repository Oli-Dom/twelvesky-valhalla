import Link from "next/link";
import { Button } from "./button";
import { Download } from "lucide-react";

export function DownloadButton() {
  return (
    <Link
      href="https://drive.google.com/file/d/1w24X2PPmv4yit8LgdJF7KXUsxcFwYipp/view?usp=sharing"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button size="lg" className="fire-button animate-pulse-gold">
        <Download className="mr-2 h-5 w-5" />
        Download Now
      </Button>
     </Link>
  );
}

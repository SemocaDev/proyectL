import { DEVMINDS_URL } from "@/lib/config";

export function DevMindsCredit() {
  return (
    <a
      href={DEVMINDS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Sitio web de DevMinds"
      className="font-credit text-ginnezumi hover:text-beni hover:underline transition-all duration-200"
    >
      DevMinds
    </a>
  );
}

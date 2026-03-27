import { TermsGate } from "@/components/auth/terms-gate";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TermsGate>{children}</TermsGate>;
}

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Enforce login for checkout
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  return <SessionProviderWrapper session={session}>{children}</SessionProviderWrapper>;
}

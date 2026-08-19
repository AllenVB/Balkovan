import type { ReactNode } from "react";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { demoAccount } from "@/lib/account";

/**
 * Hesap bolumunun ortak yerlesimi: solda yan menu, sagda icerik.
 * Tum /hesabim/* sayfalari bu duzeni paylasir.
 */
export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg flex flex-col md:flex-row gap-gutter">
      <AccountSidebar memberTitle={demoAccount.memberTitle} />
      <div className="flex-grow flex flex-col gap-stack-md">{children}</div>
    </div>
  );
}

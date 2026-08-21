import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { getAccount } from "@/server/account";

/**
 * Hesap bolumunun ortak yerlesimi: solda yan menu, sagda icerik.
 * Oturum yoksa girise yonlendirilir; giristen sonra buraya donulur.
 */
export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const account = await getAccount();
  if (!account) redirect("/giris?devam=/hesabim");

  return (
    <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg flex flex-col md:flex-row gap-gutter">
      <AccountSidebar memberTitle={account.memberTitle} />
      <div className="flex-grow flex flex-col gap-stack-md">{children}</div>
    </div>
  );
}

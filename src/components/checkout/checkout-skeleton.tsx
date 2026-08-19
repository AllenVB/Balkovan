/** Odeme adimlarinda sepet/adres depodan okunana kadar gosterilen yer tutucu. */
export function CheckoutSkeleton() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-stack-lg">
      <div className="h-64 rounded-xl bg-surface-container-low animate-pulse" />
      <span className="sr-only">Yükleniyor</span>
    </div>
  );
}

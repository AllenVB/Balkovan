/**
 * Kullanilan Material Symbols ikonlari.
 *
 * NEDEN LISTE TUTUYORUZ: Material Symbols'un tam fontu ~3.9 MB. Google Fonts
 * `icon_names` parametresiyle yalnizca sayilan ikonlari iceren bir alt kume
 * uretiyor (39 ikon icin ~48 KB, %99 kucuk). Mobilde en buyuk kazanc burada.
 *
 * YENI IKON EKLERKEN: once bu listeye ekle. Liste ayni zamanda `IconName`
 * tipini urettigi icin, listede olmayan bir ikon adi kullanmak derleme
 * hatasi verir — ikonun sessizce kaybolmasi mumkun degil.
 *
 * Liste alfabetik tutulur.
 */
export const iconNames = [
  "add",
  "add_shopping_cart",
  "arrow_back",
  "arrow_forward",
  "calendar_today",
  "call",
  "card_giftcard",
  "chat",
  "check",
  "check_circle",
  "chevron_right",
  "close",
  "credit_card",
  "delete",
  "eco",
  "favorite",
  "filter_alt_off",
  "history",
  "hive",
  "info",
  "inventory_2",
  "local_offer",
  "local_shipping",
  "location_on",
  "mail",
  "map",
  "menu",
  "park",
  "person",
  "photo_camera",
  "play_arrow",
  "redeem",
  "remove",
  "scale",
  "science",
  "send",
  "settings",
  "share",
  "shopping_bag",
  "shopping_basket",
  "shopping_cart",
  "star",
  "stars",
  "storefront",
  "support_agent",
  "thermostat",
  "verified",
  "water_drop",
] as const;

export type IconName = (typeof iconNames)[number];

/** layout.tsx'in <link> ile yukledigi, yalnizca yukaridaki ikonlari iceren stylesheet. */
export const materialSymbolsHref =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" +
  `&icon_names=${iconNames.join(",")}` +
  "&display=swap";

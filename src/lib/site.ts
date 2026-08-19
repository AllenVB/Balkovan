/**
 * Site geneli sabitler.
 *
 * Iletisim bilgileri birden fazla ekranda geciyor; tek kaynak burasi.
 */

/**
 * WhatsApp destek hatti.
 * Bicim: ulke kodu dahil, yalnizca rakam (wa.me bunu bekliyor).
 * 0544 453 01 25 -> 90 544 453 01 25
 */
export const WHATSAPP_NUMBER = "905444530125";

/** Musteriye gorunen, okunakli hali. */
export const WHATSAPP_DISPLAY = "+90 544 453 01 25";

/** Telefonla arama icin. Iletisim sayfasi bunu kullanir. */
export const PHONE_HREF = `tel:+${WHATSAPP_NUMBER}`;

/** Destek saatleri; iletisim sayfasinda telefonun altinda gorunur. */
export const SUPPORT_HOURS = "(Pzt-Cum, 09:00 - 18:00)";

const WHATSAPP_GREETING = "Merhaba, Balkovan hakkında bilgi almak istiyorum.";

/** wa.me baglantisi; mesaj on tanimli gelir. */
export const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_GREETING,
)}`;

export const CONTACT_EMAIL = "merhaba@balkovan.com.tr";

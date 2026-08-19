/**
 * Site geneli sabitler.
 *
 * Iletisim bilgileri birden fazla ekranda geciyor; tek kaynak burasi.
 */

/**
 * WhatsApp destek hatti.
 *
 * TODO YOK - bilerek yer tutucu: gercek numara henuz verilmedi. Numara gelince
 * yalnizca burasi degisecek, baglanti uretimi otomatik guncellenir.
 * Bicim: ulke kodu dahil, yalnizca rakam (wa.me bunu bekliyor).
 */
export const WHATSAPP_NUMBER = "905551234567";

/** Musteriye gorunen, okunakli hali. */
export const WHATSAPP_DISPLAY = "+90 555 123 45 67";

const WHATSAPP_GREETING = "Merhaba, Balkovan hakkında bilgi almak istiyorum.";

/** wa.me baglantisi; mesaj on tanimli gelir. */
export const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_GREETING,
)}`;

export const CONTACT_EMAIL = "merhaba@balkovan.com.tr";

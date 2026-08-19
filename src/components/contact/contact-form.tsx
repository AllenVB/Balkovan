"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@/components/ui/icon";

const contactSchema = z.object({
  name: z.string().min(2, "Adınızı ve soyadınızı yazın."),
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  subject: z.string().min(1, "Lütfen bir konu seçin."),
  message: z.string().min(10, "Mesajınız en az 10 karakter olmalı."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const subjects = [
  { value: "siparis", label: "Sipariş Durumu" },
  { value: "toptan", label: "Toptan Alım" },
  { value: "urun", label: "Ürünler Hakkında Bilgi" },
  { value: "diger", label: "Diğer" },
];

const inputClassName =
  "w-full bg-surface-bright border-2 border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-0 focus:outline-none transition-colors";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  // Mesaj gonderimi bir servise baglanmadi; backend fazinda burasi
  // gercek gonderim cagrisiyla degistirilecek.
  const onSubmit = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block font-label-md text-label-md text-on-surface-variant mb-2"
            htmlFor="name"
          >
            Adınız Soyadınız
          </label>
          <input
            id="name"
            type="text"
            placeholder="Ahmet Yılmaz"
            className={inputClassName}
            aria-invalid={errors.name ? "true" : undefined}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <label
            className="block font-label-md text-label-md text-on-surface-variant mb-2"
            htmlFor="email"
          >
            E-posta Adresiniz
          </label>
          <input
            id="email"
            type="email"
            placeholder="ahmet@ornek.com"
            className={inputClassName}
            aria-invalid={errors.email ? "true" : undefined}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <div>
        <label
          className="block font-label-md text-label-md text-on-surface-variant mb-2"
          htmlFor="subject"
        >
          Konu
        </label>
        <select
          id="subject"
          className={`${inputClassName} appearance-none`}
          aria-invalid={errors.subject ? "true" : undefined}
          {...register("subject")}
        >
          <option value="">Lütfen bir konu seçin</option>
          {subjects.map((subject) => (
            <option key={subject.value} value={subject.value}>
              {subject.label}
            </option>
          ))}
        </select>
        <FieldError message={errors.subject?.message} />
      </div>

      <div>
        <label
          className="block font-label-md text-label-md text-on-surface-variant mb-2"
          htmlFor="message"
        >
          Mesajınız
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Size nasıl yardımcı olabiliriz?"
          className={`${inputClassName} resize-y`}
          aria-invalid={errors.message ? "true" : undefined}
          {...register("message")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      {isSubmitSuccessful ? (
        <p
          role="status"
          className="bg-primary-fixed border border-primary rounded-lg p-4 font-body-md text-body-md text-on-primary-fixed"
        >
          Mesaj gönderimi henüz etkin değil. Bize doğrudan{" "}
          <a
            href="mailto:merhaba@balkovan.com.tr"
            className="font-bold underline hover:text-primary"
          >
            merhaba@balkovan.com.tr
          </a>{" "}
          adresinden ulaşabilirsiniz.
        </p>
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-4 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:bg-on-primary-container transition-colors duration-300 flex items-center justify-center warm-shadow-hover"
        >
          <span>Mesajı Gönder</span>
          <Icon name="send" className="ml-2 text-sm" />
        </button>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 font-label-md text-label-md text-error">{message}</p>
  );
}

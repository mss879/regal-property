"use server";

import { LOTS } from "@/lib/lots";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  errors?: Partial<Record<"name" | "email" | "phone" | "lot" | "message", string>>;
  values?: Record<string, string>;
  name?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const values = {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    lot: get("lot"),
    interest: get("interest"),
    message: get("message"),
  };

  // Honeypot: bots fill the hidden "company" field. Pretend it worked.
  if (get("company")) return { status: "success", name: values.name };

  const errors: EnquiryState["errors"] = {};
  if (values.name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL.test(values.email)) errors.email = "Please enter a valid email address.";
  if (values.phone && !/^[+\d][\d\s()-]{6,}$/.test(values.phone)) errors.phone = "Please check the phone number.";
  if (values.lot && values.lot !== "any" && !LOTS.some((l) => l.id === values.lot)) errors.lot = "Please choose a lot from the list.";
  if (values.message.length > 2000) errors.message = "Please keep your message under 2,000 characters.";

  if (Object.keys(errors).length) return { status: "error", errors, values };

  // TODO: deliver the enquiry (e.g. email info@regalpropertysl.com via Resend, or post to a CRM).
  // Until a provider is configured, enquiries are only validated and logged on the server.
  console.info("[enquiry]", { ...values, receivedAt: new Date().toISOString() });

  return { status: "success", name: values.name.split(" ")[0] };
}

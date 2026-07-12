"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { WishlistFormState } from "@/app/[locale]/wishlist/actions";
import type { Locale } from "@/i18n/settings";
import type { Messages } from "@/messages";
import type { PlaceToTry } from "@/types/database";

type Props = {
  locale: Locale;
  messages: Messages;
  place?: PlaceToTry;
  action: (state: WishlistFormState, formData: FormData) => Promise<WishlistFormState>;
};

const initialState: WishlistFormState = { ok: false };

export function WishlistForm({ locale, messages, place, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="fiesta-card space-y-5 rounded-[1.25rem] p-4 sm:p-6">
      {state.message ? (
        <p className="rounded-lg bg-[#fff1f3] px-4 py-3 text-sm font-medium text-[#b12d48]">
          {state.message}
        </p>
      ) : null}

      <Field label={messages.wishlist.name} name="name" required defaultValue={place?.name} />
      <Field label={messages.wishlist.nameEn} name="name_en" defaultValue={place?.name_en ?? ""} />
      <Field label={messages.wishlist.area} name="area" required defaultValue={place?.area} />
      <Textarea label={messages.wishlist.note} name="note" defaultValue={place?.note ?? ""} />
      <Textarea label={messages.wishlist.noteEn} name="note_en" defaultValue={place?.note_en ?? ""} />
      <Field
        label={messages.wishlist.googleMapsUrl}
        name="google_maps_url"
        type="url"
        defaultValue={place?.google_maps_url ?? ""}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#e35f50] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#e35f50]/20 transition hover:bg-[#c94d41] disabled:opacity-60"
        >
          {pending
            ? messages.common.saving
            : place
              ? messages.wishlist.submitEdit
              : messages.wishlist.submitCreate}
        </button>
        <Link
          href={`/${locale}/wishlist`}
          className="rounded-full border border-[#3c2b2b]/15 bg-white px-5 py-3 text-center text-sm font-black text-[#654843] transition hover:bg-[#fff2e8]"
        >
          {messages.common.cancel}
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-800">
        {label} {required ? <span className="text-xs text-red-600">*</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-[#9b5544]/20 bg-[#fffdf9] px-3 py-3 text-base text-[#2c1c25] outline-none ring-[#277c70] transition focus:ring-2"
      />
    </label>
  );
}

function Textarea({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-800">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        className="w-full rounded-lg border border-[#9b5544]/20 bg-[#fffdf9] px-3 py-3 text-base text-[#2c1c25] outline-none ring-[#277c70] transition focus:ring-2"
      />
    </label>
  );
}

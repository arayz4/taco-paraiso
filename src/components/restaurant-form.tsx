"use client";

import { useActionState } from "react";
import type { Locale } from "@/i18n/settings";
import type { Messages } from "@/messages";
import type { Restaurant } from "@/types/database";
import type { FormState } from "@/app/[locale]/restaurants/actions";
import { sceneTagKeys } from "@/lib/validation";

type Props = {
  locale: Locale;
  messages: Messages;
  restaurant?: Restaurant;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const initialState: FormState = { ok: false };

export function RestaurantForm({ locale, messages, restaurant, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="fiesta-card space-y-5 rounded-lg p-3 sm:p-6">
      {state.message ? (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            state.ok ? "bg-[#dff8ef] text-[#075f5b]" : "bg-[#fff1f3] text-[#b12d48]"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <Field label={messages.form.name} name="name" required defaultValue={restaurant?.name} />
      <Field label={messages.form.nameEn} name="name_en" defaultValue={restaurant?.name_en ?? ""} />
      <Field label={messages.form.area} name="area" required defaultValue={restaurant?.area} />
      <Field label={messages.form.tacoName} name="taco_name" required defaultValue={restaurant?.taco_name} />

      <RatingSelect
        label={messages.form.rating}
        name="rating"
        defaultValue={restaurant?.rating ?? 5}
        messages={messages}
      />

      <RatingSelect
        label={messages.form.atmosphereRating}
        name="atmosphere_rating"
        defaultValue={restaurant?.atmosphere_rating ?? 5}
        messages={messages}
      />

      <fieldset>
        <legend className="mb-2 block text-sm font-semibold text-stone-800">
          {messages.form.sceneTags}
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {sceneTagKeys.map((tag) => (
            <label
              key={tag}
              className="flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-[#ffc83d]/50 bg-white px-3 py-2 text-center text-sm font-black text-[#78313f] transition has-checked:border-[#0b8d88] has-checked:bg-[#dff8ef] has-checked:text-[#075f5b]"
            >
              <input
                type="checkbox"
                name="scene_tags"
                value={tag}
                defaultChecked={Boolean(restaurant?.scene_tags?.includes(tag))}
                className="sr-only"
              />
              {messages.restaurants.sceneTagLabels[tag]}
            </label>
          ))}
        </div>
      </fieldset>

      <Textarea label={messages.form.comment} name="comment" required defaultValue={restaurant?.comment} />
      <Textarea label={messages.form.commentEn} name="comment_en" defaultValue={restaurant?.comment_en ?? ""} />
      <Field
        label={messages.form.googleMapsUrl}
        name="google_maps_url"
        type="url"
        defaultValue={restaurant?.google_maps_url ?? ""}
      />

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-800">
          {messages.form.photo}
        </span>
        <input
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="w-full min-w-0 rounded-lg border border-[#e5b646]/50 bg-[#fffdf7] px-3 py-3 text-sm text-[#4b3443] file:mr-3 file:rounded-full file:border-0 file:bg-[#0b8d88] file:px-3 file:py-2 file:text-sm file:font-bold file:text-white sm:file:px-4"
        />
        <span className="mt-2 block text-xs text-stone-500">{messages.form.photoHelp}</span>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[#ff5a72] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#ff5a72]/25 transition hover:bg-[#e94862] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {pending
            ? messages.common.saving
            : restaurant
              ? messages.form.submitEdit
              : messages.form.submitCreate}
        </button>
        <a
          href={`/${locale}/restaurants${restaurant ? `/${restaurant.id}` : ""}`}
          className="rounded-full border border-[#ffc83d]/50 bg-white px-5 py-3 text-center text-sm font-black text-[#78313f] transition hover:bg-[#fff2b8]"
        >
          {messages.common.cancel}
        </a>
      </div>
    </form>
  );
}

function RatingSelect({
  label,
  name,
  defaultValue,
  messages,
}: {
  label: string;
  name: string;
  defaultValue: number;
  messages: Messages;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-800">
        {label} <Required messages={messages} />
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-[#e5b646]/50 bg-[#fffdf7] px-3 py-3 text-base text-[#241326] outline-none ring-[#0b8d88] transition focus:ring-2"
      >
        {[5, 4, 3, 2, 1].map((value) => (
          <option key={value} value={value}>
            {value}/5
          </option>
        ))}
      </select>
    </label>
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
        {label} {required ? <RequiredText /> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-[#e5b646]/50 bg-[#fffdf7] px-3 py-3 text-base text-[#241326] outline-none ring-[#0b8d88] transition focus:ring-2"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-800">
        {label} {required ? <RequiredText /> : null}
      </span>
      <textarea
        name={name}
        required={required}
        defaultValue={defaultValue}
        rows={4}
        className="w-full rounded-lg border border-[#e5b646]/50 bg-[#fffdf7] px-3 py-3 text-base text-[#241326] outline-none ring-[#0b8d88] transition focus:ring-2"
      />
    </label>
  );
}

function Required({ messages }: { messages: Messages }) {
  return <span className="text-xs text-red-600">({messages.common.required})</span>;
}

function RequiredText() {
  return <span className="text-xs text-red-600">*</span>;
}

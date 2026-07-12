"use client";

import { useActionState } from "react";
import type { Locale } from "@/i18n/settings";
import type { Messages } from "@/messages";
import type { LoginState } from "@/app/[locale]/login/actions";

type Props = {
  locale: Locale;
  messages: Messages;
  action: (state: LoginState, formData: FormData) => Promise<LoginState>;
};

const initialState: LoginState = { ok: false };

export function LoginForm({ messages, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="fiesta-card space-y-5 rounded-lg p-4 sm:p-5">
      {state.message ? (
        <p className="rounded-lg bg-[#fff1f3] px-4 py-3 text-sm font-medium text-[#b12d48]">
          {state.message}
        </p>
      ) : null}
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-800">
          {messages.auth.email}
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-[#e5b646]/50 bg-[#fffdf7] px-3 py-3 text-base text-[#241326] outline-none ring-[#0b8d88] transition focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-800">
          {messages.auth.password}
        </span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-[#e5b646]/50 bg-[#fffdf7] px-3 py-3 text-base text-[#241326] outline-none ring-[#0b8d88] transition focus:ring-2"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#0b8d88] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#0b8d88]/25 transition hover:bg-[#08736f] disabled:opacity-60"
      >
        {pending ? messages.common.loading : messages.auth.submit}
      </button>
      <p className="text-sm leading-6 text-stone-600">{messages.auth.noSignup}</p>
    </form>
  );
}

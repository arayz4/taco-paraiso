"use client";

import { LogOut } from "lucide-react";
import type { Messages } from "@/messages";

type Props = {
  action: () => void;
  messages: Messages;
};

export function LogoutButton({ action, messages }: Props) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-[#fff6df] shadow-sm transition hover:bg-white/15 sm:min-h-0 sm:px-4"
      >
        <LogOut size={16} aria-hidden="true" />
        {messages.common.logout}
      </button>
    </form>
  );
}

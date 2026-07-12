"use client";

import { Trash2 } from "lucide-react";
import type { Messages } from "@/messages";

type Props = {
  action: () => void;
  messages: Messages;
};

export function DeleteRestaurantButton({ action, messages }: Props) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(messages.restaurants.deleteConfirm)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#ff5a72]/30 bg-white px-4 py-2 text-sm font-black text-[#b12d48] transition hover:bg-[#fff1f3]"
      >
        <Trash2 size={16} aria-hidden="true" />
        {messages.common.delete}
      </button>
    </form>
  );
}

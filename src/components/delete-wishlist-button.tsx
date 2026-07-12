"use client";

import { Trash2 } from "lucide-react";
import type { Messages } from "@/messages";

export function DeleteWishlistButton({ action, messages }: { action: () => void; messages: Messages }) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(messages.wishlist.deleteConfirm)) event.preventDefault();
      }}
    >
      <button
        type="submit"
        title={messages.common.delete}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e35f50]/20 bg-white text-[#b43f38] transition hover:bg-[#fff1ee]"
      >
        <Trash2 size={16} aria-hidden="true" />
        <span className="sr-only">{messages.common.delete}</span>
      </button>
    </form>
  );
}

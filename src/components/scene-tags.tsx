import type { Messages } from "@/messages";
import { sceneTagKeys } from "@/lib/validation";

type SceneTag = (typeof sceneTagKeys)[number];

type Props = {
  tags: string[] | null;
  messages: Messages;
};

export function SceneTags({ tags, messages }: Props) {
  const safeTags = (tags ?? []).filter((tag): tag is SceneTag =>
    sceneTagKeys.includes(tag as SceneTag),
  );

  if (safeTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {safeTags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-[#fff2b8] px-2.5 py-1 text-xs font-black text-[#78313f]"
        >
          {messages.restaurants.sceneTagLabels[tag]}
        </span>
      ))}
    </div>
  );
}

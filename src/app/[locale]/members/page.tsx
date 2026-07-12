import { notFound } from "next/navigation";
import { HeartHandshake, Sparkles } from "lucide-react";
import { isLocale, type Locale } from "@/i18n/settings";
import { getMessages } from "@/messages";

type Props = {
  params: Promise<{ locale: string }>;
};

const swatches = [
  "from-[#f6bd45] via-[#f08a4b] to-[#e35f50]",
  "from-[#38bda8] via-[#277c70] to-[#284d63]",
  "from-[#ed6d9a] via-[#ba4d6e] to-[#70395c]",
  "from-[#ffd166] via-[#7fd7c7] to-[#277c70]",
  "from-[#f08a4b] via-[#e35f50] to-[#ba4d6e]",
  "from-[#7fd7c7] via-[#f6bd45] to-[#e35f50]",
];

export default async function MembersPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const messages = getMessages(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
      <section className="relative overflow-hidden rounded-[1.5rem] border border-[#3c2b2b]/10 bg-[#fffaf3] p-6 shadow-2xl shadow-[#6d3d2f]/10 sm:rounded-[2rem] sm:p-10">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#e35f50] via-[#f6bd45] to-[#277c70]" />
        <div className="max-w-2xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#f6bd45] text-[#2c1c25]">
            <HeartHandshake size={21} aria-hidden="true" />
          </div>
          <p className="section-kicker text-xs font-black uppercase text-[#9d433c]">
            {messages.members.kicker}
          </p>
          <h1 className="text-balance-mobile mt-3 text-4xl font-black text-[#2c1c25] sm:text-6xl">
            {messages.members.title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#654843] sm:text-lg">
            {messages.members.description}
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {messages.members.members.map((member, index) => (
          <article
            key={member.name}
            className="fiesta-card overflow-hidden rounded-[1.25rem] bg-white/90 p-5"
          >
            <div
              className={`flex aspect-[4/3] items-end rounded-[1rem] bg-gradient-to-br ${swatches[index % swatches.length]} p-4 text-white shadow-lg shadow-[#6d3d2f]/10`}
            >
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-black backdrop-blur-sm">
                  {member.name.slice(0, 1)}
                </div>
                <h2 className="text-2xl font-black">{member.name}</h2>
                <p className="mt-1 text-sm font-bold text-white/85">{member.role}</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase text-[#9d433c]">
                  <Sparkles size={14} aria-hidden="true" />
                  {messages.members.favoriteLabel}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#4b3443]">
                  {member.favorite}
                </p>
              </div>
              <p className="border-t border-[#3c2b2b]/10 pt-4 text-sm leading-6 text-[#654843]">
                {member.note}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

import { SideNav } from "@/components/side-nav";
import { getNotesByModule } from "@/lib/notes";

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  const modules = getNotesByModule().map(({ module, notes }) => ({
    slug: module.slug,
    title: module.title,
    index: module.index,
    notes: notes.map((n) => ({ href: n.href, title: n.title, number: n.number })),
  }));

  return (
    <div className="flex">
      <SideNav modules={modules} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

import { NoticeItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";

const NoticeBoardSection = ({ notices }: { notices: NoticeItem[] }) => {
  const activeNotices = notices.filter((notice) => notice.active);

  if (activeNotices.length === 0) return null;

  return (
    <SectionWrapper title="Ilmoitustaulu">
      <ul className="space-y-6 text-muted">
        {activeNotices.map((notice) => (
          <li
            key={
              (notice as any).id ??
              `${notice.title}-${notice.content.slice(0, 16)}`
            }
          >
            <h3 className="font-semibold text-[var(--text-main)]">
              {notice.title}
            </h3>
            <p>{notice.content}</p>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
};

export default NoticeBoardSection;

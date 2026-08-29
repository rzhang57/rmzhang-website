export default function ProjectCard({
  name,
  blurb,
  lang,
  link,
}: {
  name: string;
  blurb: string;
  lang: string;
  link?: string;
}) {
  const body = (
    <>
      <span className="shrink-0 text-ink transition-transform group-hover:translate-x-1">
        {name}
      </span>
      <span className="flex-1 truncate text-muted">{blurb}</span>
      <span className="shrink-0 text-faint">{lang}</span>
    </>
  );

  return (
    <li>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="row group flex items-baseline gap-4 py-2 text-[15px]"
        >
          {body}
        </a>
      ) : (
        <div className="group flex items-baseline gap-4 py-2 text-[15px]">
          {body}
        </div>
      )}
    </li>
  );
}

export default function SectionHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h1 className="mb-8 text-[2rem] font-normal leading-none tracking-[-0.03em]">
      {children}
    </h1>
  );
}

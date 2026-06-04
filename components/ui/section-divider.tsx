export default function SectionDivider() {
  return (
    <div className="relative h-px overflow-visible">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1EA8D4]/25 to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-1.5 h-1.5 bg-[#1EA8D4]/40 rotate-45" />
    </div>
  );
}

export default function AmenityTag({
  label,
  values,
  delay,
}: {
  label: string;
  values: string[];
  delay: number;
}) {
  return (
    <div
      className="flex w-fit animate-fade-up !cursor-default items-center gap-2.5 rounded-full border border-[#CCCC] px-[15px] pb-[14px] pt-[13px] text-[13px]"
      style={{ animationDelay: `${delay * 60}ms` }}>
      <span className="shrink-0 font-normal text-[#717171]">{label}</span>
      <span className="font-medium">{values.join(" ، ")}</span>
    </div>
  );
}

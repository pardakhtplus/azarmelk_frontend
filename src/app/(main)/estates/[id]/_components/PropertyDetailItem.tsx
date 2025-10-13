export default function PropertyDetailItem({
  label,
  value,
  icon,
  delay,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  delay: number;
}) {
  return (
    <div className="flex w-full items-center justify-start">
      <div
        className="flex w-full animate-fade-up flex-col items-center gap-[5px]"
        style={{ animationDelay: `${delay * 80}ms` }}>
        <div className="flex size-14 items-center justify-center rounded-full bg-[#EEEEEE] text-[#717171]">
          {icon}
        </div>
        <p className="mt-[5px] text-xs font-normal text-[#717171]">{label}</p>
        <p className="text-xs font-medium text-black">{value}</p>
      </div>
    </div>
  );
}

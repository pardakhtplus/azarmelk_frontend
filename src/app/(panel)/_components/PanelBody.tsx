export default function PanelBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full px-4 pb-4 lg:py-4 lg:pl-4 lg:pr-0 xl:py-5 xl:pl-5">
      <div className="block h-full w-full overflow-hidden rounded-2xl bg-background p-4 pt-5 md:p-10 md:pt-8 lg:col-span-9">
        {children}
      </div>
    </div>
  );
}

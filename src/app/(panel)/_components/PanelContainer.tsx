export default function PanelContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto flex h-full min-h-dvh w-full max-w-[1600px] flex-col items-stretch gap-x-5 gap-y-4 lg:flex-row xl:gap-5">
      {children}
    </main>
  );
}

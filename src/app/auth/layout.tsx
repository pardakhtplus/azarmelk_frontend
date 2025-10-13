export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="bg-admin-bg min-h-dvh">{children}</main>;
}

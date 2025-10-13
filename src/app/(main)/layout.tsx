import Footer from "./_components/Footer";
import Header from "./_components/Header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {/*  max-w-screen-2xl px-6 */}
      <main className="mx-auto">{children}</main>
      <Footer />
    </div>
  );
}

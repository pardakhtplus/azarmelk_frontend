import PanelBody from "../_components/PanelBody";
import PanelContainer from "../_components/PanelContainer";
import PanelMenu from "../_components/PanelMenu";
import { menuData } from "./_components/routes";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-dvh bg-admin-bg">
      <PanelContainer>
        <PanelMenu menuData={menuData} profileUrl="/dashboard/profile" />
        <PanelBody>{children}</PanelBody>
      </PanelContainer>
    </main>
  );
}

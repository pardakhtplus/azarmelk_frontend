import PanelBody from "../_components/PanelBody";
import PanelContainer from "../_components/PanelContainer";
import PanelMenu from "../_components/PanelMenu";
import { menuData } from "../dashboard/_components/routes";

export default function ForbiddenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-dvh bg-admin-bg">
      <PanelContainer>
        <PanelMenu menuData={menuData} profileUrl="/user-panel" />
        <PanelBody>{children}</PanelBody>
      </PanelContainer>
    </main>
  );
}

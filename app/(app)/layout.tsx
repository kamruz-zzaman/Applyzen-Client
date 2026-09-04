import { AppSidebar } from "@/components/AppSidebar";
import { TopNavbar } from "@/components/TopNavbar";

// Fixed to the viewport, not min-h-screen — the sidebar and navbar are chrome
// that should never move. Only <main> scrolls internally when its content
// overflows.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-stone-50">
      <AppSidebar />
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <TopNavbar />
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

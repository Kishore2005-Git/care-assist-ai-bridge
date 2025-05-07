
import { Header } from "@/components/Header";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

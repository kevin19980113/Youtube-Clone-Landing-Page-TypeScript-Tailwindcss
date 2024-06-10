import { CategoryPills } from "./components/CategoryPhills";
import { PageHeader } from "./layouts/PageHeader";
import { Suspense } from "react";
import { Sidebar } from "./layouts/Sidebar";
import { SidebarProvider } from "./contexts/SidebarContext";
import VideoGridItemWrapper from "./layouts/VideoGridItemWrapper.tsx";

function App() {
  return (
    <SidebarProvider>
      <main className="max-h-screen flex flex-col">
        <PageHeader />
        <section className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
          <Sidebar />
          <div className="overflow-x-hidden px-8 pb-4">
            <div className="sticky top-0 bg-white z-10 pb-4">
              <CategoryPills />
            </div>
            <Suspense>
              <VideoGridItemWrapper />
            </Suspense>
          </div>
        </section>
      </main>
    </SidebarProvider>
  );
}

export default App;

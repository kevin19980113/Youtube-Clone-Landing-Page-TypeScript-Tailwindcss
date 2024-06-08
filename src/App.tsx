import { CategoryPills } from "./components/CategoryPhills";
import { PageHeader } from "./layouts/PageHeader";
import { categories } from "./data/home";
import { useState } from "react";
import { Sidebar } from "./layouts/Sidebar";
import { SidebarProvider } from "./contexts/SidebarContext";
import { DataContextProvider } from "./contexts/DataContext.tsx";
import VideoGridItemWrapper from "./layouts/VideoGridItemWrapper.tsx";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <DataContextProvider>
      <SidebarProvider>
        <main className="max-h-screen flex flex-col">
          <PageHeader />
          <section className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
            <Sidebar />
            <div className="overflow-x-hidden px-8 pb-4">
              <div className="sticky top-0 bg-white z-10 pb-4">
                <CategoryPills
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelect={setSelectedCategory}
                />
              </div>
              <VideoGridItemWrapper />
            </div>
          </section>
        </main>
      </SidebarProvider>
    </DataContextProvider>
  );
}

export default App;

import { CateogryPills } from "./components/CategoryPhills";
import { PageHeader } from "./layouts/PageHeader";
import { categories, videos } from "./data/home";
import { useState } from "react";
import { VideoGridItem } from "./components/VideoGridItem";
import { Sidebar } from "./layouts/Sidebar";
import { SidebarProvider } from "./contexts/SidebarContext";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  return (
    <SidebarProvider>
      <main className="max-h-screen flex flex-col">
        <PageHeader />
        <section className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
          <Sidebar />

          <div className="overflow-x-hidden px-4 pb-4 scrollbar-hidden">
            <div className="sticky top-0 bg-white z-10 pb-4">
              <CateogryPills
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
              {videos.map((video) => (
                <VideoGridItem key={video.id} {...video} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </SidebarProvider>
  );
}

export default App;

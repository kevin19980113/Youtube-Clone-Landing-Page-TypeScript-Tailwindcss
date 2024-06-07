import { CategoryPills } from "./components/CategoryPhills";
import { PageHeader } from "./layouts/PageHeader";
import { categories } from "./data/home";
import { useState } from "react";
import { VideoGridItem } from "./components/VideoGridItem";
import { Sidebar } from "./layouts/Sidebar";
import { SidebarProvider } from "./contexts/SidebarContext";
import { useFetchPopularVideos } from "./hooks/useFetchData.tsx";
import { dataProcessor } from "./hooks/useFetchData.tsx";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const { isLoading, videoes, channels } = useFetchPopularVideos();

  const processedVideoes =
    videoes && channels ? dataProcessor(videoes, channels) : null;

  return (
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
            {!isLoading && (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                {processedVideoes?.map((video) => (
                  <VideoGridItem key={video.id} {...video} />
                ))}
              </div>
            )}
            {isLoading && <div>loading,,,</div>}
          </div>
        </section>
      </main>
    </SidebarProvider>
  );
}

export default App;

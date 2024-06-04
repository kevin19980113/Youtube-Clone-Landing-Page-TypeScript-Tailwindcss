import { CateogryPills } from "./components/CategoryPhills";
import { PageHeader } from "./layouts/PageHeader";
import { categories } from "./data/home";
import { useState } from "react";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  return (
    <main className="max-h-screen flex flex-col">
      <PageHeader />
      <section className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
        <div>Sidebar</div>

        <div className="overflow-x-hidden px-4 pb-4">
          <div className="sticky top-0 bg-white z-10 pb-4">
            <CateogryPills
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;

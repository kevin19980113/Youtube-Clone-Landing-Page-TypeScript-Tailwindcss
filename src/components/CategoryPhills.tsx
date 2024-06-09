import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Button } from "./Button";
import { useEffect, useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

const TRANSLATE_AMOUNT = 300;

type CategoryPhillsProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export function CategoryPills({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryPhillsProps) {
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(false);
  const [translate, setTranslate] = useState(0);
  const [actualWidth, setActualWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current == null) return;

    setActualWidth(containerRef.current.scrollWidth);
  }, []);

  useEffect(() => {
    if (containerRef.current == null) return;

    const observer = new ResizeObserver((entries) => {
      const container = entries[0]?.target as HTMLDivElement;

      setIsLeftVisible(translate > 0);
      setIsRightVisible(translate + container.clientWidth < actualWidth);
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  });

  return (
    <div className="overflow-x-hidden relative" ref={containerRef}>
      <div
        className="flex whitespace-nowrap gap-3 transition-transform w-[max-content]"
        style={{
          transform: `translateX(-${translate}px)`,
        }}
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "dark" : "default"}
            onClick={() => onSelectCategory(category)}
            className="py-1 px-3 rounded-lg whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
      {isLeftVisible && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r
       from-white from-50% to-transparent w-24 h-full flex justify-start"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-full aspect-square w-auto p-2"
            onClick={() =>
              setTranslate((translate) => {
                const newTranslate = translate - TRANSLATE_AMOUNT;
                if (newTranslate <= 0) return 0;
                return newTranslate;
              })
            }
          >
            <MdKeyboardArrowLeft />
          </Button>
        </div>
      )}
      {isRightVisible && (
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l
       from-white from-50% to-transparent w-24 h-full flex justify-end"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-full aspect-square w-auto p-2"
            onClick={() =>
              setTranslate((translate) => {
                if (containerRef.current === null) return translate;

                const newTranslate = translate + TRANSLATE_AMOUNT;
                const visibleWidth = containerRef.current.clientWidth;

                if (newTranslate + visibleWidth >= actualWidth) {
                  return actualWidth - visibleWidth;
                }

                return newTranslate;
              })
            }
          >
            <MdKeyboardArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
}

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Button } from "./Button";
import { useEffect, useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";
import { useDataContext } from "../hooks/useDataContext";
import { fetchPopularVideoData, fetchSearchVideoData } from "../utils/http";

const TRANSLATE_AMOUNT = 300;

export function CategoryPills() {
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(false);
  const [translate, setTranslate] = useState(0);
  const [actualWidth, setActualWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { state, dispatch } = useDataContext();

  const categories = [
    { id: "all", name: "All" },
    ...Array.from(
      new Map(
        state.videoData.map((videoData) => [
          videoData.categoryId,
          {
            id: videoData.categoryId,
            name: videoData.category,
          },
        ])
      ).values()
    ),
  ];

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

  async function handleSelectCategory(category: string, categoryId: string) {
    if (category === "All") {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "CLEAR_VIDEO_DATA" });

        const { processedData, nextToken } =
          state.action === "POPULAR"
            ? await fetchPopularVideoData(null, null)
            : await fetchSearchVideoData(state.searchTerm, null, null);
        dispatch({ type: "SET_VIDEO_DATA", payload: processedData });
        dispatch({ type: "SET_NEXT_PAGE_TOKEN", payload: nextToken });
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
        dispatch({
          type: "SET_SELECTED_CATEGORY",
          payload: { category, categoryId },
        });
      }
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_VIDEO_DATA" });

      const { processedData, nextToken } =
        state.action === "POPULAR"
          ? await fetchPopularVideoData(state.nextPageToken, categoryId)
          : await fetchSearchVideoData(
              state.searchTerm,
              state.nextPageToken,
              categoryId
            );

      dispatch({ type: "SET_VIDEO_DATA", payload: processedData });
      dispatch({ type: "SET_NEXT_PAGE_TOKEN", payload: nextToken });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({
        type: "SET_SELECTED_CATEGORY",
        payload: { category: category, categoryId: categoryId },
      });
    }
  }

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
            key={category.id}
            variant={
              state.selectedCategory === category.name ? "dark" : "default"
            }
            onClick={() => handleSelectCategory(category.name, category.id)}
            className="py-1 px-3 rounded-lg whitespace-nowrap"
          >
            {category.name}
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

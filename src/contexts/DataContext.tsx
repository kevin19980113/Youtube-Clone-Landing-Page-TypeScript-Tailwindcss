import { createContext, useReducer, ReactNode, useEffect } from "react";
import { fetchPopularVideoData, fetchSearchVideoData } from "../utils/http";

type FetchedVideoData = {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId: string;
  channel: {
    name: string;
    id: string;
    profileThumbnailUrl: string;
    channelUrl: string;
  };
  views: string;
  postedAt: Date;
  duration: string;
  thumbnailUrl: string;
};

type State = {
  videoData: FetchedVideoData[];
  isLoading: boolean;
  action: string;
  selectedCategory: string;
  selectedCategoryId: string | null;
  searchTerm: string;
  nextPageToken: string | null;
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_NEW_SEARCH_TERM"; payload: string }
  | { type: "SET_NEXT_PAGE_TOKEN"; payload: string }
  | { type: "SET_NEW_ACTION"; payload: string }
  | {
      type: "SET_SELECTED_CATEGORY";
      payload: { category: string; categoryId: string };
    }
  | { type: "SET_VIDEO_DATA"; payload: FetchedVideoData[] }
  | {
      type: "LOAD_MORE_VIDEO_DATA";
      payload: { processedData: FetchedVideoData[]; nextToken: string };
    }
  | { type: "CLEAR_VIDEO_DATA" };

const initialState: State = {
  videoData: [],
  isLoading: true,
  action: "POPULAR",
  selectedCategory: "All",
  selectedCategoryId: null,
  searchTerm: "",
  nextPageToken: null,
};

function dataReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_NEW_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_NEXT_PAGE_TOKEN":
      return { ...state, nextPageToken: action.payload };
    case "SET_NEW_ACTION":
      return { ...state, action: action.payload };
    case "SET_SELECTED_CATEGORY":
      return {
        ...state,
        selectedCategory: action.payload.category,
        selectedCategoryId: action.payload.categoryId,
      };
    case "SET_VIDEO_DATA":
      return {
        ...state,
        videoData: [...action.payload],
      };

    case "LOAD_MORE_VIDEO_DATA":
      return {
        ...state,
        videoData: [...state.videoData, ...action.payload.processedData],
        nextPageToken: action.payload.nextToken,
      };
    case "CLEAR_VIDEO_DATA":
      return {
        ...state,
        videoData: [],
      };
    default:
      return state;
  }
}

export const DataContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  loadMoreData: () => void;
}>({ state: initialState, dispatch: () => null, loadMoreData: () => null });

type DataContextProviderProps = {
  children: ReactNode;
};

export function DataContextProvider({ children }: DataContextProviderProps) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { processedData, nextToken } = await fetchPopularVideoData(
          state.nextPageToken,
          state.selectedCategoryId
        );
        dispatch({ type: "SET_VIDEO_DATA", payload: processedData });
        dispatch({ type: "SET_NEXT_PAGE_TOKEN", payload: nextToken });
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    fetchData();
  }, []);

  const loadMoreData = () => {
    if (state.action === "POPULAR") {
      const fetchData = async () => {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          const { processedData, nextToken } = await fetchPopularVideoData(
            state.nextPageToken,
            state.selectedCategoryId !== "All" ? state.selectedCategoryId : null
          );
          dispatch({
            type: "LOAD_MORE_VIDEO_DATA",
            payload: { processedData, nextToken },
          });
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
          }
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      };
      fetchData();
    }

    if (state.action === "SEARCH") {
      const fetchData = async () => {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          const { processedData, nextToken } = await fetchSearchVideoData(
            state.searchTerm,
            state.nextPageToken,
            state.selectedCategoryId !== "All" ? state.selectedCategoryId : null
          );
          dispatch({
            type: "LOAD_MORE_VIDEO_DATA",
            payload: { processedData, nextToken },
          });
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
          }
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      };
      fetchData();
    }
  };

  return (
    <DataContext.Provider value={{ state, dispatch, loadMoreData }}>
      {children}
    </DataContext.Provider>
  );
}

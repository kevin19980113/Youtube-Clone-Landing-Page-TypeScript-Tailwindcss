import { createContext, useReducer, ReactNode, useEffect } from "react";
import { fetchPopularVideoData, fetchSearchVideoData } from "../utils/http";

type FetchedVideoData = {
  id: string;
  title: string;
  description: string;
  category: string;
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

type Data = {
  popularVideoData: FetchedVideoData[];
  searchVideoData: FetchedVideoData[];
};

type State = {
  data: Data;
  isLoading: boolean;
  action: string;
  selectedCategory: string;
  searchTerm: string;
  nextPageToken: string | null;
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_NEW_SEARCH_TERM"; payload: string }
  | { type: "SET_NEXT_PAGE_TOKEN"; payload: string }
  | { type: "SET_NEW_ACTION"; payload: string }
  | { type: "SET_SELECTED_CATEGORY"; payload: string }
  | { type: "SET_POPULAR_VIDEO_DATA"; payload: FetchedVideoData[] }
  | { type: "SET_SEARCHED_DATA"; payload: FetchedVideoData[] }
  | {
      type: "LOAD_MORE_POPULAR_VIDEO_DATA";
      payload: { processedData: FetchedVideoData[]; nextToken: string };
    }
  | {
      type: "LOAD_MORE_SEARCH_VIDEO_DATA";
      payload: { processedData: FetchedVideoData[]; nextToken: string };
    };

const initialState: State = {
  data: {
    popularVideoData: [],
    searchVideoData: [],
  },
  isLoading: true,
  action: "POPULAR",
  selectedCategory: "All",
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
      return { ...state, selectedCategory: action.payload };
    case "SET_POPULAR_VIDEO_DATA":
      return {
        ...state,
        data: { ...state.data, popularVideoData: action.payload },
      };
    case "SET_SEARCHED_DATA":
      return {
        ...state,
        data: { ...state.data, searchVideoData: action.payload },
      };
    case "LOAD_MORE_POPULAR_VIDEO_DATA":
      return {
        ...state,
        data: {
          ...state.data,
          popularVideoData: [
            ...state.data.popularVideoData,
            ...action.payload.processedData,
          ],
        },
        nextPageToken: action.payload.nextToken,
      };
    case "LOAD_MORE_SEARCH_VIDEO_DATA":
      return {
        ...state,
        data: {
          ...state.data,
          searchVideoData: [
            ...state.data.searchVideoData,
            ...action.payload.processedData,
          ],
        },
        nextPageToken: action.payload.nextToken,
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
          state.nextPageToken
        );
        dispatch({ type: "SET_POPULAR_VIDEO_DATA", payload: processedData });
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
            state.nextPageToken
          );
          dispatch({
            type: "LOAD_MORE_POPULAR_VIDEO_DATA",
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
            state.nextPageToken
          );
          dispatch({
            type: "LOAD_MORE_SEARCH_VIDEO_DATA",
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

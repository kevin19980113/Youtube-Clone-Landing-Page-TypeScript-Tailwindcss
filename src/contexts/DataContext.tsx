/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
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

type DataContextType = {
  data: Data;
  isLoading: boolean;
  action: string;
  selectedCategory: string;
  setLoading: (loading: boolean) => void;
  setSearchedData: (searchedData: FetchedVideoData[]) => void;
  setNewSearchTerm: (searchTerm: string) => void;
  setNextPageToken: (newToken: string) => void;
  setNewAction: (newAction: string) => void;
  setSelectedCategory: (selectedCategory: string) => void;
  loadMoreData: () => void;
};

const DataContext = createContext({} as DataContextType);

type DataContextProviderProps = {
  children: ReactNode;
};

export function DataContextProvider({ children }: DataContextProviderProps) {
  const [data, setData] = useState<Data>({
    popularVideoData: [],
    searchVideoData: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [nextPageToken, setNewToken] = useState<string | null>(null);
  const [action, setAction] = useState<string>("POPULAR");
  const [selectedCategory, setCategory] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { processedData, nextToken } = await fetchPopularVideoData(
          nextPageToken
        );
        setData((prevData) => {
          return {
            ...prevData,
            popularVideoData: [...processedData],
          };
        });
        setNewToken(nextToken);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  function setSearchedData(searchedData: FetchedVideoData[]) {
    setData((prevData) => {
      return {
        ...prevData,
        searchVideoData: [...searchedData],
      };
    });
  }

  function setLoading(loading: boolean) {
    setIsLoading(loading);
  }

  function setNextPageToken(newToken: string) {
    setNewToken(newToken);
  }

  function setNewSearchTerm(searchTerm: string) {
    setSearchTerm(searchTerm);
  }

  function setNewAction(newAction: string) {
    setAction(newAction);
  }

  function setSelectedCategory(selectedCategory: string) {
    setCategory(selectedCategory);
  }

  function loadMoreData() {
    if (action === "POPULAR") {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const { processedData, nextToken } = await fetchPopularVideoData(
            nextPageToken
          );

          setData((prevData) => {
            return {
              ...prevData,
              popularVideoData: [
                ...prevData.popularVideoData,
                ...processedData,
              ],
            };
          });
          setNewToken(nextToken);
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }

    if (action === "SEARCH") {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const { processedData, nextToken } = await fetchSearchVideoData(
            searchTerm,
            nextPageToken
          );

          setData((prevData) => {
            return {
              ...prevData,
              searchVideoData: [...prevData.searchVideoData, ...processedData],
            };
          });
          setNewToken(nextToken);
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }

  const dataContextValue = {
    data,
    isLoading,
    action,
    selectedCategory,
    setNewSearchTerm,
    setSearchedData,
    setNextPageToken,
    setLoading,
    setNewAction,
    setSelectedCategory,
    loadMoreData,
  };

  return (
    <DataContext.Provider value={dataContextValue}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  return useContext(DataContext);
}

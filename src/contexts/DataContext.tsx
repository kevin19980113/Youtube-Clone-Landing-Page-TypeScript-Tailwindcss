import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { fetchPopularVideoData } from "../utils/http";
import { maxSearchResults } from "../utils/http";

type FetchedData = {
  id: string;
  title: string;
  channel: {
    name: string;
    id: string;
    profileThumbnailUrl: string | undefined;
    channelUrl: string | undefined;
  };
  views: string;
  postedAt: Date;
  duration: string;
  thumbnailUrl: string;
};

type DataContextType = {
  data: FetchedData[];
  isLoading: boolean;
  setFetchedData: (searchedData: FetchedData[]) => void;
  setLoading: (loading: boolean) => void;
};

const DataContext = createContext({} as DataContextType);

type DataContextProviderProps = {
  children: ReactNode;
};

export function DataContextProvider({ children }: DataContextProviderProps) {
  const [data, setData] = useState<FetchedData[]>(
    new Array(maxSearchResults).fill(null)
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await fetchPopularVideoData();

        setData(fetchedData);
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

  function setFetchedData(searchedData: FetchedData[]) {
    setData(searchedData);
  }

  function setLoading(loading: boolean) {
    setIsLoading(loading);
  }

  const dataContextValue = {
    data,
    isLoading,
    setFetchedData,
    setLoading,
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

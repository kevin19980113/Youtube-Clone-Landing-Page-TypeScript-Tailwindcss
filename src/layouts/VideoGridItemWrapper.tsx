import { VideoGridItem } from "../components/VideoGridItem";
import { useDataContext } from "../contexts/DataContext";
import { maxSearchResults } from "../utils/http";

export default function VideoGridItemWrapper() {
  const { data, isLoading } = useDataContext();

  if (isLoading) {
    const tempData = new Array(maxSearchResults).fill(null);
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {tempData.map((video, index) => (
          <VideoGridItem key={index} {...video} isLoading={isLoading} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {data?.map((video) => (
        <VideoGridItem key={video.id} {...video} isLoading={isLoading} />
      ))}
    </div>
  );
}

import { VideoGridItem } from "../components/VideoGridItem";
import { useDataContext } from "../contexts/DataContext";

export default function VideoGridItemWrapper() {
  const { data, isLoading } = useDataContext();

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {data?.map((video, index) => (
        <VideoGridItem
          key={video ? video.id : index}
          {...video}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

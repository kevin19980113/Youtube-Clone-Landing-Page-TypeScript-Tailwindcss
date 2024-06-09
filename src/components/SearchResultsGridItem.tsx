import { forwardRef, useEffect, useRef, useState } from "react";
import { formatDuration } from "../utils/formatDuration";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { VIEW_FORMATTER } from "./PopularVideoGridItem";

type SearchResultsGridItem = {
  id: string;
  title: string;
  description: string;
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
  //videoUrl: string;
};

export const SearchResultsGridItem = forwardRef<
  HTMLDivElement,
  SearchResultsGridItem
>(
  (
    {
      id,
      title,
      description,
      channel,
      views,
      postedAt,
      duration,
      thumbnailUrl,
    },
    ref
  ) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoRef.current == null) return;

      if (isVideoPlaying) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }, [isVideoPlaying]);

    return (
      <div ref={ref} className="flex w-full gap-4">
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          className="w-5/12 min-w-[400px] relative aspect-video flex-shrink-0"
          onMouseEnter={() => setIsVideoPlaying(true)}
          onMouseLeave={() => setIsVideoPlaying(false)}
        >
          <img
            src={thumbnailUrl}
            alt={title}
            className={`block w-full object-cover transition-[border-radius] duration-200 ${
              isVideoPlaying ? "rounded-none" : "rounded-2xl"
            }`}
            loading="lazy"
          />
          <div
            className="absolute bottom-1 right-1 bg-secondary-dark text-secondary text-xs
          px-1 rounded-md"
          >
            {formatDuration(duration)}
          </div>

          {/* <video
            ref={videoRef}
            muted
            playsInline
            src={videoUrl}
            className={`block h-full object-cover absolute inset-0 transition-opacity duration-200 delay-200 ${
              isVideoPlaying ? "opacity-100" : "opacity-0"
            }`}
          ></video> */}
        </a>
        <div className="flex flex-col gap-0.5 text-secondary-text text-sm">
          <a
            href={`https://www.youtube.com/watch?v=${id}`}
            className="text-secondary-dark hover:text-secondary-dark-hover font-semibold text-lg"
          >
            {title}
          </a>
          <div>{`${VIEW_FORMATTER.format(
            Number(views)
          )} views • ${formatTimeAgo(postedAt)}`}</div>
          <div className="flex gap-2 items-center my-4">
            <a
              href={`https://www.youtube.com/${channel.channelUrl}`}
              className="flex-shrink-0"
            >
              <img
                src={channel.profileThumbnailUrl}
                alt="profile photo"
                className="size-8 rounded-full"
                loading="lazy"
              />
            </a>
            <a
              href={`https://www.youtube.com/${channel.channelUrl}`}
              className="hover:text-secondary-dark-hover max-w-fit"
            >
              {channel.name}
            </a>
          </div>
          <div className="line-clamp-2">{description}</div>
        </div>
      </div>
    );
  }
);

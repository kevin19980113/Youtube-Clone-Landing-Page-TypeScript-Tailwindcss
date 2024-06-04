import { useEffect, useRef, useState } from "react";
import { formatDuation } from "../utils/formatDuration";
import { formatTimeAgo } from "../utils/formatTimeAgo";

type VideoGridItemProps = {
  id: string;
  title: string;
  channel: {
    name: string;
    id: string;
    profileUrl: string;
  };
  views: number;
  postedAt: Date;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
};

const VIEW_FORMATTER = Intl.NumberFormat(undefined, {
  notation: "compact",
});

export function VideoGridItem({
  id,
  title,
  channel,
  views,
  postedAt,
  duration,
  thumbnailUrl,
  videoUrl,
}: VideoGridItemProps) {
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
    <div className="flex flex-col gap-2">
      <a
        href={`/watch?v=${id}`}
        className="relative aspect-video"
        onMouseEnter={() => setIsVideoPlaying(true)}
        onMouseLeave={() => setIsVideoPlaying(false)}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className={`block w-full object-cover transition-[border-radius] duration-200 ${
            isVideoPlaying ? "rounded-none" : "rounded-2xl"
          }`}
        />
        <div
          className="absolute bottom-1 right-1 bg-secondary-dark text-secondary text-xs
        px-1 rounded-md"
        >
          {formatDuation(duration)}
        </div>
        <video
          ref={videoRef}
          muted
          playsInline
          src={videoUrl}
          className={`block h-full object-cover 
        absolute inset-0 transition-opacity duration-200 delay-200 ${
          isVideoPlaying ? "opacity-100" : "opacity-0"
        }`}
        ></video>
      </a>
      <div className="flex gap-2">
        <a href={`/@${channel.id}`} className="flex-shrink-0">
          <img
            src={channel.profileUrl}
            alt="profile photo"
            className="w-10 h-10 rounded-full"
          />
        </a>
        <div className="flex flex-col gap-0.5 text-secondary-text text-sm">
          <a
            href={`/watch?v=${id}`}
            className="text-secondary-dark font-semibold text-base"
          >
            {title}
          </a>
          <a
            href={`/@${channel.id}`}
            className="hover:text-secondary-dark-hover max-w-fit"
          >
            {channel.name}
          </a>
          <div>{`${VIEW_FORMATTER.format(views)} views • ${formatTimeAgo(
            postedAt
          )}`}</div>
        </div>
      </div>
    </div>
  );
}

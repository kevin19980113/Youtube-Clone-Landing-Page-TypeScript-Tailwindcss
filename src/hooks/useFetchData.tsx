import { useEffect, useState } from "react";
const API_KEY = "AIzaSyD7wxrg4xaEq7vnaGnyOczIy1LIj3Y3JY4";
const API_URL_FOR_VIDEO = "https://www.googleapis.com/youtube/v3/videos";
const API_URL_FOR_CHANNEL = "https://www.googleapis.com/youtube/v3/channels";

const maxSearchResults = 20;

type VideoSnippet = {
  title: string;
  channelTitle: string;
  channelId: string;
  publishedAt: Date;
  thumbnails: {
    medium: {
      url: string;
    };
  };
};

type videoContentDetails = {
  duration: string;
};

type videoStatistics = {
  viewCount: string;
};

type VideoData = {
  id: string;
  snippet: VideoSnippet;
  contentDetails: videoContentDetails;
  statistics: videoStatistics;
};

type ChannelSnippet = {
  customUrl: string;
  thumbnails: {
    default: {
      url: string;
    };
  };
};

type ChannelData = {
  id: string;
  snippet: ChannelSnippet;
};

type Error = {
  code: number;
  message: string;
};

type videoOriginData = {
  items: VideoData[];
  error: Error;
};

export function dataProcessor(videos: VideoData[], channels: ChannelData[]) {
  return videos.map((video) => {
    const channel = channels.find((ch) => ch.id === video.snippet.channelId);
    return {
      id: video.id,
      title: video.snippet.title,
      channel: {
        name: video.snippet.channelTitle,
        id: video.snippet.channelId,
        profileThumbnailUrl: channel?.snippet.thumbnails.default.url,
        channelUrl: channel?.snippet.customUrl,
      },
      views: video.statistics.viewCount,
      postedAt: new Date(video.snippet.publishedAt),
      duration: video.contentDetails.duration,
      thumbnailUrl: video.snippet.thumbnails.medium.url,
    };
  });
}

export const useFetchPopularVideos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoes, setVideoes] = useState<VideoData[] | null>(null);
  const [channels, setChannels] = useState<ChannelData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_URL_FOR_VIDEO}?part=statistics&part=contentDetails&part=snippet&chart=mostPopular&maxResults=${maxSearchResults}&key=${API_KEY}`
        );

        const videoData = (await response.json()) as videoOriginData;

        if (!response.ok) {
          setError("Failed to fetch Video data");
        }

        setVideoes(videoData.items);

        const channelIds = videoData.items.map(
          (video) => video.snippet.channelId
        );

        const promises = channelIds.map((channelId) =>
          fetch(
            `${API_URL_FOR_CHANNEL}?part=snippet&id=${channelId}&key=${API_KEY}`
          ).then((response) => {
            if (!response.ok) {
              setError("Failed to fetch channel data");
            }
            return response.json();
          })
        );

        const responses = await Promise.all(promises);

        const channelData = responses.flatMap(
          (response) => response.items
        ) as ChannelData[];

        setChannels(channelData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { isLoading, videoes, channels, error };
};

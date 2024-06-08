const API_KEY = "AIzaSyCOu-zWE1ECBaQKyhf3_gEM72sIzZ55djo";
const API_URL_FOR_VIDEO = "https://www.googleapis.com/youtube/v3/videos";
const API_URL_FOR_CHANNEL = "https://www.googleapis.com/youtube/v3/channels";
const API_URL_FOR_SEARCH = "https://www.googleapis.com/youtube/v3/search";

export const maxSearchResults = 10;

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

type videoOriginData = {
  items: VideoData[];
  error: Error;
};

type SearchedData = {
  items: {
    id: {
      videoId: string;
    };
    snippet: {
      channelId: string;
    };
  }[];
};

function dataProcessor(videos: VideoData[], channels: ChannelData[]) {
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

export async function fetchPopularVideoData() {
  const response = await fetch(
    `${API_URL_FOR_VIDEO}?part=statistics&part=contentDetails&part=snippet&chart=mostPopular&maxResults=${maxSearchResults}&key=${API_KEY}`
  );

  const videoData = (await response.json()) as videoOriginData;

  if (!response.ok) {
    throw new Error("Failed to fetch video data");
  }

  const channelIds = videoData.items.map((video) => video.snippet.channelId);

  const promises = channelIds.map((channelId) =>
    fetch(
      `${API_URL_FOR_CHANNEL}?part=snippet&id=${channelId}&key=${API_KEY}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch channel data");
      }
      return response.json();
    })
  );

  const responses = await Promise.all(promises);

  const channelData = responses.flatMap(
    (response) => response.items
  ) as ChannelData[];

  const processedData = dataProcessor(videoData.items, channelData);

  return processedData;
}

export async function fetchSearchVideoData(searchTerm: string) {
  const response = await fetch(
    `${API_URL_FOR_SEARCH}?part=snippet&maxResults=${maxSearchResults}&q=${searchTerm}&type=video&key=${API_KEY}`
  );
  const searchedData = (await response.json()) as SearchedData;

  if (!response.ok) {
    throw new Error("Failed to fetch search data");
  }

  const videoIds = searchedData.items.map(
    (searchResult) => searchResult.id.videoId
  );

  const videoPromises = videoIds.map((videoId) =>
    fetch(
      `${API_URL_FOR_VIDEO}?part=statistics&part=contentDetails&part=snippet&id=${videoId}&maxResults=${maxSearchResults}&key=${API_KEY}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch channel data");
      }
      return response.json();
    })
  );

  const videoResponses = await Promise.all(videoPromises);

  const videoData = videoResponses.flatMap(
    (response) => response.items
  ) as VideoData[];

  const channelIds = searchedData.items.map(
    (searchResult) => searchResult.snippet.channelId
  );

  const channelPromises = channelIds.map((channelId) =>
    fetch(
      `${API_URL_FOR_CHANNEL}?part=snippet&id=${channelId}&key=${API_KEY}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch channel data");
      }
      return response.json();
    })
  );

  const responses = await Promise.all(channelPromises);

  const channelData = responses.flatMap(
    (response) => response.items
  ) as ChannelData[];

  const processedData = dataProcessor(videoData, channelData);

  return processedData;
}

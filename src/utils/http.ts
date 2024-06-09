const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
const API_URL_FOR_VIDEO = "https://www.googleapis.com/youtube/v3/videos";
const API_URL_FOR_CHANNEL = "https://www.googleapis.com/youtube/v3/channels";
const API_URL_FOR_SEARCH = "https://www.googleapis.com/youtube/v3/search";
const API_URL_FOR_CATEGORY =
  "https://www.googleapis.com/youtube/v3/videoCategories";
export const maxSearchResults = 15;

type VideoSnippet = {
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  publishedAt: Date;
  thumbnails: {
    medium: {
      url: string;
    };
  };
  categoryId: string;
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

type videoOriginData = {
  items: VideoData[];
  nextPageToken: string;
  error: Error;
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

type SearchedData = {
  items: {
    id: {
      videoId: string;
    };
    snippet: {
      channelId: string;
    };
  }[];
  nextPageToken: string;
};

type CategoryData = {
  id: string;
  snippet: {
    title: string;
  };
};

function dataProcessor(
  videos: VideoData[],
  channels: ChannelData[],
  categories: CategoryData[]
): {
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
}[] {
  return videos
    .map((video) => {
      const channel = channels.find((ch) => ch.id === video.snippet.channelId);
      const category = categories.find(
        (category) => category.id === video.snippet.categoryId
      );
      if (channel !== undefined && category !== undefined) {
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          category: category.snippet.title,
          channel: {
            name: video.snippet.channelTitle,
            id: video.snippet.channelId,
            profileThumbnailUrl: channel.snippet.thumbnails.default.url,
            channelUrl: channel.snippet.customUrl,
          },
          views: video.statistics.viewCount,
          postedAt: new Date(video.snippet.publishedAt),
          duration: video.contentDetails.duration,
          thumbnailUrl: video.snippet.thumbnails.medium.url,
        };
      }
      return undefined;
    })
    .filter((item): item is NonNullable<typeof item> => item !== undefined);
}

export async function fetchPopularVideoData(nextPageToken: string | null) {
  const response = await fetch(
    `${API_URL_FOR_VIDEO}?part=statistics&part=contentDetails&part=snippet&chart=mostPopular${
      nextPageToken ? `&pageToken=${nextPageToken}` : ""
    }&maxResults=${maxSearchResults}&key=${API_KEY}`
  );

  const videoData = (await response.json()) as videoOriginData;

  if (!response.ok) {
    throw new Error("Failed to fetch video data");
  }

  const channelIds = videoData.items.map((video) => video.snippet.channelId);

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

  const channelResponses = await Promise.all(channelPromises);

  const channelData = channelResponses.flatMap(
    (response) => response.items
  ) as ChannelData[];

  const categoryIds = videoData.items.map((video) => video.snippet.categoryId);

  const categoryIdPromises = categoryIds.map((categoryId) =>
    fetch(
      `${API_URL_FOR_CATEGORY}?part=snippet&id=${categoryId}&key=${API_KEY}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch category data");
      }
      return response.json();
    })
  );

  const categoryResponses = await Promise.all(categoryIdPromises);

  const categoryData = categoryResponses.flatMap(
    (response) => response.items
  ) as CategoryData[];

  const processedData = dataProcessor(
    videoData.items,
    channelData,
    categoryData
  );
  return { processedData, nextToken: videoData.nextPageToken };
}

export async function fetchSearchVideoData(
  searchTerm: string,
  nextPageToken: string | null
) {
  const response = await fetch(
    `${API_URL_FOR_SEARCH}?part=snippet${
      nextPageToken ? `&pageToken=${nextPageToken}` : ""
    }&maxResults=${maxSearchResults}&q=${searchTerm}&type=video&key=${API_KEY}`
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

  const channelResponses = await Promise.all(channelPromises);

  const channelData = channelResponses.flatMap(
    (response) => response.items
  ) as ChannelData[];

  const categoryIds = videoData.map((video) => video.snippet.categoryId);

  const categoryIdPromises = categoryIds.map((categoryId) =>
    fetch(
      `${API_URL_FOR_CATEGORY}?part=snippet&id=${categoryId}&key=${API_KEY}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch category data");
      }
      return response.json();
    })
  );

  const categoryResponses = await Promise.all(categoryIdPromises);

  const categoryData = categoryResponses.flatMap(
    (response) => response.items
  ) as CategoryData[];

  const processedData = dataProcessor(videoData, channelData, categoryData);

  return { processedData, nextToken: searchedData.nextPageToken };
}

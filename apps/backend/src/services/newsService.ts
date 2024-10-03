import axios from "axios";
import { env } from "../server";

const apiKey = env.NEWS_API_KEY;
const newsApiUrl = "https://newsapi.org/v2/everything";

export const fetchNews = async (searchQuery: string) => {
  try {
    const response = await axios.get(newsApiUrl, {
      params: {
        q: searchQuery,
        apiKey: apiKey,
        language: "en",
        sortBy: "relevancy",
        pageSize: 10,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch news");
  }
};

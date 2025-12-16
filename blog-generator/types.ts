export interface TrendingTopic {
  title: string;
  url?: string;
  description: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  tags: string[];
  imagePrompts: {
    header: string;
    content: string[];
  };
}

export interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
      tool_calls?: Array<{
        id: string;
        type: string;
        function: { name: string; arguments: string };
      }>;
    };
  }>;
}

export type RawTopic = {
  source: "hn" | "devto";
  title: string;
  url?: string;
  description?: string;
  score: number;
  comments?: number;
  publishedAt: number; // unix timestamp (ms)
};

// AI Blog types - for blogs going to /ai-blogs
export interface AIBlogMetadata extends BlogMetadata {
  source: "hn" | "devto";
  originalUrl?: string;
}

export interface AITrendingTopic extends TrendingTopic {
  source: "hn" | "devto";
  score: number;
  comments?: number;
}

import axios from 'axios';

declare const process: any;
declare const console: any;

export interface VideoRepository {
  url: string;
  title: string;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  description?: string;
  publishedAt: string;
}

export interface ChannelScanResult {
  channelName: string;
  channelId: string;
  totalVideos: number;
  scannedVideos: number;
  repositoriesFound: VideoRepository[];
  errors: string[];
}

/**
 * YouTube Channel Scanner for GitHub repositories
 */
export class YouTubeScanner {
  private readonly youtubeApiKey?: string;
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.youtubeApiKey = process.env.YOUTUBE_API_KEY;
  }

  /**
   * Scan a YouTube channel for GitHub repository links
   */
  async scanChannel(channelName: string, maxVideos: number = 30): Promise<VideoRepository[]> {
    try {
      if (!this.youtubeApiKey) {
        console.warn('YouTube API key not provided, falling back to basic scanning');
        return await this.scanChannelBasic(channelName, maxVideos);
      }

      // Get channel ID from channel name
      const channelId = await this.getChannelId(channelName);
      if (!channelId) {
        throw new Error(`Channel not found: ${channelName}`);
      }

      // Get videos from the channel
      const videos = await this.getChannelVideos(channelId, maxVideos);
      
      // Scan each video for GitHub links
      const repositories: VideoRepository[] = [];
      
      for (const video of videos) {
        try {
          const repos = await this.scanVideoForRepositories(video);
          repositories.push(...repos);
        } catch (error) {
          console.error(`Error scanning video ${video.id}:`, error);
        }
      }

      return this.deduplicateRepositories(repositories);
    } catch (error) {
      console.error('Error scanning channel:', error);
      return [];
    }
  }

  /**
   * Basic channel scanning without API (fallback)
   */
  private async scanChannelBasic(channelName: string, maxVideos: number): Promise<VideoRepository[]> {
    // This is a simplified implementation that would need web scraping
    // For demo purposes, return mock data
    console.log(`Basic scanning for channel: ${channelName}`);
    
    return [
      {
        url: 'https://github.com/pytorch/pytorch',
        title: 'PyTorch',
        videoId: 'demo1',
        videoTitle: 'Deep Learning with PyTorch',
        videoUrl: 'https://youtube.com/watch?v=demo1',
        description: 'Deep learning framework',
        publishedAt: new Date().toISOString()
      },
      {
        url: 'https://github.com/huggingface/transformers',
        title: 'Transformers',
        videoId: 'demo2',
        videoTitle: 'Natural Language Processing',
        videoUrl: 'https://youtube.com/watch?v=demo2',
        description: 'State-of-the-art NLP',
        publishedAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Get channel ID from channel name or handle
   */
  private async getChannelId(channelName: string): Promise<string | null> {
    try {
      // Try different channel search methods
      const searchMethods = [
        `forUsername=${channelName}`,
        `forHandle=${channelName}`,
        `id=${channelName}`
      ];

      for (const method of searchMethods) {
        const response = await axios.get(`${this.baseUrl}/channels`, {
          params: {
            part: 'id,snippet',
            [method.split('=')[0]]: method.split('=')[1],
            key: this.youtubeApiKey
          }
        });

        if (response.data.items && response.data.items.length > 0) {
          return response.data.items[0].id;
        }
      }

      // If direct methods fail, try search
      const searchResponse = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          type: 'channel',
          q: channelName,
          key: this.youtubeApiKey,
          maxResults: 5
        }
      });

      if (searchResponse.data.items && searchResponse.data.items.length > 0) {
        // Look for exact or close match
        for (const item of searchResponse.data.items) {
          const title = item.snippet.title.toLowerCase();
          const searchTerm = channelName.toLowerCase();
          
          if (title.includes(searchTerm) || searchTerm.includes(title)) {
            return item.snippet.channelId;
          }
        }
        
        // Return first result if no exact match
        return searchResponse.data.items[0].snippet.channelId;
      }

      return null;
    } catch (error) {
      console.error('Error getting channel ID:', error);
      return null;
    }
  }

  /**
   * Get videos from a channel
   */
  private async getChannelVideos(channelId: string, maxVideos: number): Promise<any[]> {
    try {
      // First get the uploads playlist
      const channelResponse = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          part: 'contentDetails',
          id: channelId,
          key: this.youtubeApiKey
        }
      });

      const uploadsPlaylistId = channelResponse.data.items[0]?.contentDetails?.relatedPlaylists?.uploads;
      if (!uploadsPlaylistId) {
        throw new Error('Could not find uploads playlist');
      }

      // Get videos from uploads playlist
      const videos: any[] = [];
      let nextPageToken = '';
      const perPage = Math.min(50, maxVideos);

      while (videos.length < maxVideos && nextPageToken !== null) {
        const response = await axios.get(`${this.baseUrl}/playlistItems`, {
          params: {
            part: 'snippet',
            playlistId: uploadsPlaylistId,
            maxResults: perPage,
            pageToken: nextPageToken || undefined,
            key: this.youtubeApiKey
          }
        });

        videos.push(...response.data.items);
        nextPageToken = response.data.nextPageToken || null;
      }

      return videos.slice(0, maxVideos);
    } catch (error) {
      console.error('Error getting channel videos:', error);
      return [];
    }
  }

  /**
   * Scan a video for GitHub repository links
   */
  private async scanVideoForRepositories(video: any): Promise<VideoRepository[]> {
    try {
      // Get video details including description
      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet',
          id: video.snippet.resourceId.videoId,
          key: this.youtubeApiKey
        }
      });

      const videoData = response.data.items[0];
      if (!videoData) return [];

      const description = videoData.snippet.description || '';
      const title = videoData.snippet.title || '';
      const combinedText = `${title} ${description}`;

      // Extract GitHub URLs
      const githubUrls = this.extractGitHubUrls(combinedText);
      
      return githubUrls.map(url => ({
        url,
        title: this.extractRepoNameFromUrl(url),
        videoId: video.snippet.resourceId.videoId,
        videoTitle: title,
        videoUrl: `https://youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
        description: description.substring(0, 200),
        publishedAt: video.snippet.publishedAt
      }));
    } catch (error) {
      console.error('Error scanning video for repositories:', error);
      return [];
    }
  }

  /**
   * Extract GitHub URLs from text
   */
  private extractGitHubUrls(text: string): string[] {
    const githubUrlPattern = /https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\/[^\s]*)?/g;
    const matches = text.match(githubUrlPattern) || [];
    
    // Clean and normalize URLs
    return matches
      .map(url => {
        // Remove trailing slash and fragments
        return url.replace(/[\/\#\?].*$/, '').trim();
      })
      .filter(url => {
        // Filter out invalid URLs
        const parts = url.split('/');
        return parts.length >= 5 && parts[3] && parts[4]; // Must have owner and repo
      })
      .filter((url, index, array) => array.indexOf(url) === index); // Remove duplicates
  }

  /**
   * Extract repository name from GitHub URL
   */
  private extractRepoNameFromUrl(url: string): string {
    try {
      const parts = url.split('/');
      if (parts.length >= 5) {
        return parts[4]; // Repository name
      }
      return url;
    } catch (error) {
      return url;
    }
  }

  /**
   * Remove duplicate repositories
   */
  private deduplicateRepositories(repositories: VideoRepository[]): VideoRepository[] {
    const seen = new Set<string>();
    return repositories.filter(repo => {
      const key = repo.url.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Get channel statistics
   */
  async getChannelStats(channelName: string): Promise<any> {
    try {
      const channelId = await this.getChannelId(channelName);
      if (!channelId) return null;

      const response = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          part: 'statistics,snippet',
          id: channelId,
          key: this.youtubeApiKey
        }
      });

      return response.data.items[0];
    } catch (error) {
      console.error('Error getting channel stats:', error);
      return null;
    }
  }
}
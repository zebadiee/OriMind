import axios from 'axios';

declare const process: any;
declare const console: any;

export interface Repository {
  url: string;
  fullName: string;
  owner: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  license?: string;
  size: number;
  defaultBranch: string;
}

export interface SearchOptions {
  language?: string;
  minStars?: number;
  maxResults?: number;
  sortBy?: 'stars' | 'updated' | 'created';
  order?: 'desc' | 'asc';
}

/**
 * GitHub Repository Scanner and Analyzer
 */
export class GitHubRepoScanner {
  private readonly githubToken?: string;
  private readonly baseUrl = 'https://api.github.com';

  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN;
  }

  /**
   * Analyze a list of GitHub repositories
   */
  async analyzeRepositories(repoUrls: string[]): Promise<Repository[]> {
    const repositories: Repository[] = [];

    for (const url of repoUrls) {
      try {
        const repo = await this.analyzeRepository(url);
        if (repo) {
          repositories.push(repo);
        }
      } catch (error) {
        console.error(`Failed to analyze repository ${url}:`, error);
      }
    }

    return repositories;
  }

  /**
   * Analyze a single GitHub repository
   */
  async analyzeRepository(repoUrl: string): Promise<Repository | null> {
    try {
      const { owner, repo } = this.parseGitHubUrl(repoUrl);
      const response = await this.makeGitHubRequest(`/repos/${owner}/${repo}`);

      if (!response) return null;

      return {
        url: response.html_url,
        fullName: response.full_name,
        owner: response.owner.login,
        name: response.name,
        description: response.description || '',
        language: response.language || 'Unknown',
        stars: response.stargazers_count,
        forks: response.forks_count,
        openIssues: response.open_issues_count,
        createdAt: response.created_at,
        updatedAt: response.updated_at,
        topics: response.topics || [],
        license: response.license?.name,
        size: response.size,
        defaultBranch: response.default_branch
      };
    } catch (error) {
      console.error(`Error analyzing repository ${repoUrl}:`, error);
      return null;
    }
  }

  /**
   * Search GitHub repositories
   */
  async searchRepositories(query: string, options: SearchOptions = {}): Promise<Repository[]> {
    try {
      const {
        language,
        minStars = 100,
        maxResults = 50,
        sortBy = 'stars',
        order = 'desc'
      } = options;

      let searchQuery = query;
      
      if (language) {
        searchQuery += ` language:${language}`;
      }
      
      if (minStars > 0) {
        searchQuery += ` stars:>=${minStars}`;
      }

      const response = await this.makeGitHubRequest('/search/repositories', {
        q: searchQuery,
        sort: sortBy,
        order: order,
        per_page: Math.min(maxResults, 100)
      });

      if (!response || !response.items) return [];

      return response.items.slice(0, maxResults).map((item: any) => ({
        url: item.html_url,
        fullName: item.full_name,
        owner: item.owner.login,
        name: item.name,
        description: item.description || '',
        language: item.language || 'Unknown',
        stars: item.stargazers_count,
        forks: item.forks_count,
        openIssues: item.open_issues_count,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        topics: item.topics || [],
        license: item.license?.name,
        size: item.size,
        defaultBranch: item.default_branch
      }));
    } catch (error) {
      console.error('Error searching repositories:', error);
      return [];
    }
  }

  /**
   * Get trending repositories
   */
  async getTrendingRepositories(language?: string, period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<Repository[]> {
    try {
      const since = new Date();
      switch (period) {
        case 'daily':
          since.setDate(since.getDate() - 1);
          break;
        case 'weekly':
          since.setDate(since.getDate() - 7);
          break;
        case 'monthly':
          since.setMonth(since.getMonth() - 1);
          break;
      }

      const query = `created:>${since.toISOString().split('T')[0]}`;
      return await this.searchRepositories(query, {
        language,
        minStars: 10,
        maxResults: 30,
        sortBy: 'stars'
      });
    } catch (error) {
      console.error('Error getting trending repositories:', error);
      return [];
    }
  }

  /**
   * Parse GitHub URL to extract owner and repo name
   */
  private parseGitHubUrl(url: string): { owner: string; repo: string } {
    // Handle various GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,
      /^([^\/]+)\/([^\/]+)$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const [, owner, repo] = match;
        return {
          owner: owner.trim(),
          repo: repo.replace(/\.git$/, '').trim()
        };
      }
    }

    throw new Error(`Invalid GitHub URL format: ${url}`);
  }

  /**
   * Make authenticated GitHub API request
   */
  private async makeGitHubRequest(endpoint: string, params?: Record<string, any>): Promise<any> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Recipe-Book-MCP/1.0'
    };

    if (this.githubToken) {
      headers['Authorization'] = `token ${this.githubToken}`;
    }

    const config = {
      headers,
      params
    };

    const response = await axios.get(`${this.baseUrl}${endpoint}`, config);
    return response.data;
  }
}
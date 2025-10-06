#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolRequest,
  CallToolResult,
  TextContent,
  ImageContent,
  EmbeddedResource
} from "@modelcontextprotocol/sdk/types.js";
import { GitHubRepoScanner } from "./tools/github-scanner.js";
import { CompatibilityAnalyzer } from "./tools/compatibility-analyzer.js";
import { RecipeGenerator } from "./tools/recipe-generator.js";
import { YouTubeScanner } from "./tools/youtube-scanner.js";

declare const console: any;

/**
 * GitHub Recipe Book MCP Server
 * 
 * Provides tools for:
 * - Scanning YouTube channels for GitHub repositories
 * - Analyzing repository compatibility 
 * - Generating recipe combinations
 * - Managing recipe leaderboards
 */
class GitHubRecipeBookServer {
  private server: Server;
  private githubScanner: GitHubRepoScanner;
  private compatibilityAnalyzer: CompatibilityAnalyzer;
  private recipeGenerator: RecipeGenerator;
  private youtubeScanner: YouTubeScanner;

  constructor() {
    this.server = new Server({
      name: "github-recipe-book-server",
      version: "1.0.0",
    });

    this.githubScanner = new GitHubRepoScanner();
    this.compatibilityAnalyzer = new CompatibilityAnalyzer();
    this.recipeGenerator = new RecipeGenerator();
    this.youtubeScanner = new YouTubeScanner();

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "scan_youtube_channel",
            description: "Scan a YouTube channel for videos containing GitHub repository links",
            inputSchema: {
              type: "object",
              properties: {
                channel_name: {
                  type: "string",
                  description: "YouTube channel name or handle (e.g., 'manus-agi')"
                },
                max_videos: {
                  type: "number",
                  description: "Maximum number of videos to scan",
                  default: 30
                }
              },
              required: ["channel_name"]
            }
          },
          {
            name: "analyze_repositories",
            description: "Analyze a list of GitHub repositories for compatibility and metrics",
            inputSchema: {
              type: "object",
              properties: {
                repositories: {
                  type: "array",
                  items: {
                    type: "string",
                    description: "GitHub repository URL or owner/repo format"
                  },
                  description: "List of repository URLs to analyze"
                }
              },
              required: ["repositories"]
            }
          },
          {
            name: "generate_recipes",
            description: "Generate compatibility recipes from analyzed repositories",
            inputSchema: {
              type: "object",
              properties: {
                repositories: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      url: { type: "string" },
                      language: { type: "string" },
                      stars: { type: "number" },
                      description: { type: "string" }
                    }
                  },
                  description: "Repository data to generate recipes from"
                },
                max_recipes: {
                  type: "number",
                  description: "Maximum number of recipes to generate",
                  default: 15
                },
                focus_area: {
                  type: "string",
                  description: "Focus area for recipe generation (e.g., 'AI/ML', 'web-dev', 'data-science')",
                  default: "AI/ML"
                }
              },
              required: ["repositories"]
            }
          },
          {
            name: "get_recipe_leaderboard",
            description: "Get the current recipe leaderboard with rankings and scores",
            inputSchema: {
              type: "object",
              properties: {
                limit: {
                  type: "number",
                  description: "Number of top recipes to return",
                  default: 20
                },
                sort_by: {
                  type: "string",
                  enum: ["overall_score", "compatibility_score", "stars", "trending"],
                  description: "Sorting criteria for leaderboard",
                  default: "overall_score"
                }
              }
            }
          },
          {
            name: "search_repositories",
            description: "Search GitHub for repositories matching specific criteria",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query for repositories"
                },
                language: {
                  type: "string",
                  description: "Programming language filter"
                },
                min_stars: {
                  type: "number",
                  description: "Minimum star count",
                  default: 100
                },
                max_results: {
                  type: "number",
                  description: "Maximum number of results",
                  default: 50
                }
              },
              required: ["query"]
            }
          }
        ] as Tool[]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<CallToolResult> => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "scan_youtube_channel":
            return await this.handleYouTubeChannelScan(args);
          
          case "analyze_repositories":
            return await this.handleRepositoryAnalysis(args);
          
          case "generate_recipes":
            return await this.handleRecipeGeneration(args);
          
          case "get_recipe_leaderboard":
            return await this.handleGetLeaderboard(args);
          
          case "search_repositories":
            return await this.handleRepositorySearch(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return {
          content: [
            {
              type: "text",
              text: `Error executing ${name}: ${errorMessage}`
            } as TextContent
          ],
          isError: true
        };
      }
    });
  }

  private async handleYouTubeChannelScan(args: any): Promise<CallToolResult> {
    const { channel_name, max_videos = 30 } = args;
    
    const repositories = await this.youtubeScanner.scanChannel(channel_name, max_videos);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            channel: channel_name,
            videos_scanned: max_videos,
            repositories_found: repositories.length,
            repositories: repositories
          }, null, 2)
        } as TextContent
      ],
      isError: false
    };
  }

  private async handleRepositoryAnalysis(args: any): Promise<CallToolResult> {
    const { repositories } = args;
    
    const analysis = await this.githubScanner.analyzeRepositories(repositories);
    const compatibility = await this.compatibilityAnalyzer.analyzeCompatibility(analysis);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            total_repositories: repositories.length,
            analyzed_repositories: analysis.length,
            compatibility_analysis: compatibility
          }, null, 2)
        } as TextContent
      ],
      isError: false
    };
  }

  private async handleRecipeGeneration(args: any): Promise<CallToolResult> {
    const { repositories, max_recipes = 15, focus_area = "AI/ML" } = args;
    
    const recipes = await this.recipeGenerator.generateRecipes(repositories, max_recipes, focus_area);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            focus_area: focus_area,
            recipes_generated: recipes.length,
            recipes: recipes
          }, null, 2)
        } as TextContent
      ],
      isError: false
    };
  }

  private async handleGetLeaderboard(args: any): Promise<CallToolResult> {
    const { limit = 20, sort_by = "overall_score" } = args;
    
    const leaderboard = await this.recipeGenerator.getLeaderboard(limit, sort_by);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            sorted_by: sort_by,
            total_recipes: leaderboard.length,
            leaderboard: leaderboard
          }, null, 2)
        } as TextContent
      ],
      isError: false
    };
  }

  private async handleRepositorySearch(args: any): Promise<CallToolResult> {
    const { query, language, min_stars = 100, max_results = 50 } = args;
    
    const results = await this.githubScanner.searchRepositories(query, {
      language,
      minStars: min_stars,
      maxResults: max_results
    });
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            query: query,
            filters: { language, min_stars },
            results_count: results.length,
            repositories: results
          }, null, 2)
        } as TextContent
      ],
      isError: false
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("GitHub Recipe Book MCP server running on stdio");
  }
}

// Run the server
const server = new GitHubRecipeBookServer();
server.run().catch(console.error);
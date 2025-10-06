# GitHub Recipe Book MCP Server

A Model Context Protocol (MCP) server that provides intelligent GitHub repository discovery and recipe generation capabilities.

## Features

- **YouTube Channel Scanning**: Automatically scan YouTube channels for GitHub repository links
- **Repository Analysis**: Analyze GitHub repositories for compatibility, popularity, and maintainability
- **Recipe Generation**: Generate intelligent combinations of repositories that work well together
- **Compatibility Scoring**: Advanced scoring system that considers language compatibility, domain alignment, and licensing
- **Dynamic Leaderboards**: Maintain ranked lists of the best repository combinations

## MCP Tools

### `scan_youtube_channel`
Scan a YouTube channel for videos containing GitHub repository links.

**Parameters:**
- `channel_name` (string): YouTube channel name or handle
- `max_videos` (number, optional): Maximum number of videos to scan (default: 30)

### `analyze_repositories`
Analyze a list of GitHub repositories for compatibility and metrics.

**Parameters:**
- `repositories` (array): List of repository URLs to analyze

### `generate_recipes`
Generate compatibility recipes from analyzed repositories.

**Parameters:**
- `repositories` (array): Repository data to generate recipes from
- `max_recipes` (number, optional): Maximum number of recipes to generate (default: 15)
- `focus_area` (string, optional): Focus area for recipes (default: "AI/ML")

### `get_recipe_leaderboard`
Get the current recipe leaderboard with rankings and scores.

**Parameters:**
- `limit` (number, optional): Number of top recipes to return (default: 20)
- `sort_by` (string, optional): Sorting criteria ("overall_score", "compatibility_score", "stars", "trending")

### `search_repositories`
Search GitHub for repositories matching specific criteria.

**Parameters:**
- `query` (string): Search query for repositories
- `language` (string, optional): Programming language filter
- `min_stars` (number, optional): Minimum star count (default: 100)
- `max_results` (number, optional): Maximum number of results (default: 50)

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file with optional API keys:
```
GITHUB_TOKEN=your_github_token_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 3. Build and Run
```bash
npm run build
npm start
```

### 4. VS Code Integration
Add this to your VS Code MCP configuration (`settings.json`):

```json
{
  "mcp.servers": {
    "github-recipe-book": {
      "command": "node",
      "args": ["path/to/mcp-recipe-server/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "your_token_here",
        "YOUTUBE_API_KEY": "your_key_here"
      }
    }
  }
}
```

## Architecture

The server consists of several specialized tools:

- **GitHubRepoScanner**: Fetches and analyzes GitHub repository data
- **YouTubeScanner**: Extracts repository links from YouTube videos  
- **CompatibilityAnalyzer**: Scores repository combinations for compatibility
- **RecipeGenerator**: Creates intelligent repository combination recipes

## Compatibility Scoring

The system uses a multi-factor scoring algorithm:

- **Language Compatibility** (25%): How well programming languages work together
- **Domain Alignment** (20%): Whether repositories serve complementary purposes
- **License Compatibility** (15%): Legal compatibility of repository licenses
- **Maintainability** (20%): Repository maintenance status and activity
- **Popularity** (20%): Community adoption and star ratings

## Recipe Types

Generated recipes are categorized by use case:

- **Full Stack**: Complete web development stacks
- **ML Pipeline**: Machine learning workflows
- **Data Science**: Analytics and visualization platforms
- **DevOps Toolkit**: Infrastructure and deployment tools
- **Mobile Development**: Cross-platform mobile app stacks

## Usage Examples

### Scan Manus AGI Channel
```typescript
const result = await callTool("scan_youtube_channel", {
  channel_name: "manus-agi",
  max_videos: 50
});
```

### Generate AI/ML Recipes
```typescript
const recipes = await callTool("generate_recipes", {
  repositories: repoData,
  max_recipes: 20,
  focus_area: "AI/ML"
});
```

### Get Top Recipes
```typescript
const leaderboard = await callTool("get_recipe_leaderboard", {
  limit: 10,
  sort_by: "overall_score"
});
```
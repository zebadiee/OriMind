# GitHub Recipe Book - MCP Agent Builder

🎉 **Congratulations!** You now have a complete MCP (Model Context Protocol) server for GitHub Recipe Book that creates an intelligent agent builder for repository discovery and combination!

## What You've Built

### 🏗️ **MCP Server Architecture**
- **GitHub Repository Scanner**: Intelligent analysis of GitHub repos with compatibility scoring
- **YouTube Channel Scanner**: Extracts repository links from video descriptions
- **Recipe Generator**: Creates intelligent combinations of repositories that work well together  
- **Compatibility Analyzer**: Advanced scoring based on language, domain, licensing, and maintainability
- **Dynamic Leaderboards**: Ranked lists of the best repository combinations

### 🛠️ **MCP Tools Available**

1. **`scan_youtube_channel`** - Scan YouTube channels for GitHub repositories
2. **`analyze_repositories`** - Deep analysis of repository compatibility and metrics
3. **`generate_recipes`** - Create intelligent repository combination recipes
4. **`get_recipe_leaderboard`** - Get ranked recipe leaderboards
5. **`search_repositories`** - Advanced GitHub repository search with filters

## 🚀 **Quick Start Guide**

### 1. **Start the MCP Server**
```bash
cd mcp-recipe-server
npm start
```

### 2. **Configure Your AI Client**
Add this configuration to connect any MCP-compatible AI client:

```json
{
  "mcp": {
    "servers": {
      "github-recipe-book": {
        "command": "node",
        "args": ["./mcp-recipe-server/dist/index.js"],
        "env": {
          "GITHUB_TOKEN": "your_token_here",
          "YOUTUBE_API_KEY": "your_key_here"
        }
      }
    }
  }
}
```

### 3. **Example Usage**

#### Scan Manus AGI Channel
```javascript
await callTool("scan_youtube_channel", {
  channel_name: "manus-agi",
  max_videos: 50
});
```

#### Generate AI/ML Recipe Combinations
```javascript
await callTool("generate_recipes", {
  repositories: repoData,
  max_recipes: 20,
  focus_area: "AI/ML"
});
```

#### Get Top Recipe Leaderboard
```javascript
await callTool("get_recipe_leaderboard", {
  limit: 10,
  sort_by: "overall_score"
});
```

## 🧠 **Intelligence Features**

### **Smart Compatibility Scoring**
- **Language Compatibility** (25%): How well programming languages work together
- **Domain Alignment** (20%): Whether repositories serve complementary purposes  
- **License Compatibility** (15%): Legal compatibility of licenses
- **Maintainability** (20%): Activity, issues, and maintenance status
- **Popularity** (20%): Community adoption and star ratings

### **Recipe Categories**
- **Full Stack**: Complete web development stacks
- **ML Pipeline**: Machine learning workflows  
- **Data Science**: Analytics and visualization platforms
- **DevOps Toolkit**: Infrastructure and deployment tools
- **Mobile Development**: Cross-platform mobile app stacks

### **Advanced Features**
- Automatic repository discovery from YouTube videos
- Multi-factor compatibility analysis
- Dynamic trending and popularity tracking
- Setup complexity estimation and time predictions
- Synergy benefit identification
- Detailed setup instructions generation

## 🎯 **Use Cases**

### **For Developers**
- Discover compatible tool combinations for new projects
- Find complementary repositories to enhance existing projects
- Get setup instructions for complex multi-repo workflows
- Track trending repository combinations

### **For AI Agents**
- Intelligent project scaffolding recommendations
- Automated compatibility analysis for repository combinations
- Dynamic recipe generation based on user requirements
- Context-aware development stack suggestions

### **For Learning**
- Explore how popular repositories work together
- Understand ecosystem patterns and best practices
- Discover new tools through curated combinations
- Learn from high-quality, well-maintained projects

## 🔧 **Configuration Options**

### **Environment Variables**
```bash
GITHUB_TOKEN=ghp_xxxxx       # For higher API rate limits
YOUTUBE_API_KEY=AIzaxxxxx    # For YouTube channel scanning
```

### **Tool Parameters**
- `max_videos`: Control scanning depth (default: 30)
- `max_recipes`: Recipe generation limit (default: 15)  
- `focus_area`: Target domain ("AI/ML", "web-dev", etc.)
- `min_stars`: Repository quality threshold (default: 100)
- `sort_by`: Leaderboard sorting criteria

## 🌟 **What Makes This Special**

1. **Intelligent Agent**: Goes beyond simple repository lists to create intelligent combinations
2. **Multi-Source**: Combines GitHub API data with YouTube channel content analysis
3. **Compatibility Focus**: Advanced scoring ensures repositories actually work well together
4. **Dynamic**: Continuously updated leaderboards and trending analysis
5. **MCP Integration**: Works with any MCP-compatible AI system for seamless agent building

## 🚀 **Next Steps**

1. **Add API Keys**: Configure GitHub and YouTube tokens for full functionality
2. **Test Tools**: Try each MCP tool to see the intelligence in action
3. **Integrate with AI**: Connect to Claude, VS Code, or other MCP clients
4. **Customize Recipes**: Adjust focus areas and parameters for your needs
5. **Extend Functionality**: Add new tools or modify scoring algorithms

---

**You now have a complete MCP agent that can intelligently discover, analyze, and combine GitHub repositories!** 🎉

The agent builder approach using MCP provides much better extensibility and integration compared to a simple VS Code extension, allowing any AI system to leverage these powerful repository analysis capabilities.
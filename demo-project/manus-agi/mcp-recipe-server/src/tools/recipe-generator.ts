import { Repository } from './github-scanner.js';
import { CompatibilityScore } from './compatibility-analyzer.js';

declare const console: any;

export interface Recipe {
  name: string;
  description: string;
  useCase: string;
  repositories: Repository[];
  compatibilityScore: number;
  setupComplexity: 'simple' | 'moderate' | 'complex';
  estimatedSetupTime: string;
  synergyBenefits: string[];
  tags: string[];
  instructions: RecipeInstruction[];
  prerequisites: string[];
}

export interface RecipeInstruction {
  step: number;
  title: string;
  description: string;
  commands?: string[];
  notes?: string;
}

export interface LeaderboardEntry {
  recipe: Recipe;
  overallScore: number;
  rank: number;
  trendingDirection: 'up' | 'down' | 'stable' | 'new';
  popularityTrend: number;
  lastUpdated: string;
}

/**
 * Recipe Generator and Leaderboard Manager
 */
export class RecipeGenerator {
  private recipes: Recipe[] = [];
  private leaderboard: LeaderboardEntry[] = [];

  /**
   * Generate recipes from repository data
   */
  async generateRecipes(repositories: Repository[], maxRecipes: number = 15, focusArea: string = 'AI/ML'): Promise<Recipe[]> {
    const generatedRecipes: Recipe[] = [];

    // Generate different types of recipe combinations
    const recipeTypes = [
      { name: 'Full Stack', minRepos: 3, maxRepos: 4, focus: 'web-dev' },
      { name: 'ML Pipeline', minRepos: 2, maxRepos: 4, focus: 'ai-ml' },
      { name: 'Data Science Stack', minRepos: 3, maxRepos: 5, focus: 'data-science' },
      { name: 'DevOps Toolkit', minRepos: 2, maxRepos: 4, focus: 'devops' },
      { name: 'Mobile Development', minRepos: 2, maxRepos: 3, focus: 'mobile' }
    ];

    // Filter repositories by focus area
    const focusedRepos = this.filterRepositoriesByFocus(repositories, focusArea);
    
    // Sort by popularity and quality
    const sortedRepos = focusedRepos.sort((a, b) => {
      const scoreA = this.calculateRepositoryQuality(a);
      const scoreB = this.calculateRepositoryQuality(b);
      return scoreB - scoreA;
    });

    for (const recipeType of recipeTypes) {
      if (generatedRecipes.length >= maxRecipes) break;

      const typeRecipes = await this.generateRecipeType(
        sortedRepos,
        recipeType,
        Math.ceil(maxRecipes / recipeTypes.length)
      );
      
      generatedRecipes.push(...typeRecipes);
    }

    // Store generated recipes
    this.recipes = generatedRecipes.slice(0, maxRecipes);
    
    // Update leaderboard
    await this.updateLeaderboard();

    return this.recipes;
  }

  /**
   * Generate recipes of a specific type
   */
  private async generateRecipeType(
    repositories: Repository[],
    recipeType: any,
    maxForType: number
  ): Promise<Recipe[]> {
    const recipes: Recipe[] = [];
    const typeRepos = this.filterRepositoriesByFocus(repositories, recipeType.focus);
    
    // Generate combinations
    const combinations = this.generateRepositoryCombinations(
      typeRepos.slice(0, 20), // Limit to top 20 repos for performance
      recipeType.minRepos,
      recipeType.maxRepos
    );

    for (const combo of combinations.slice(0, maxForType)) {
      const recipe = await this.createRecipeFromCombination(combo, recipeType);
      if (recipe) {
        recipes.push(recipe);
      }
    }

    return recipes;
  }

  /**
   * Create a recipe from a repository combination
   */
  private async createRecipeFromCombination(repositories: Repository[], recipeType: any): Promise<Recipe | null> {
    try {
      const compatibilityScore = this.calculateCombinationCompatibility(repositories);
      
      if (compatibilityScore < 0.4) return null; // Skip low compatibility combinations

      const name = this.generateRecipeName(repositories, recipeType.name);
      const description = this.generateRecipeDescription(repositories, recipeType);
      const useCase = this.generateUseCase(repositories, recipeType);
      const setupComplexity = this.calculateSetupComplexity(repositories);
      const estimatedSetupTime = this.estimateSetupTime(repositories, setupComplexity);
      const synergyBenefits = this.identifySynergyBenefits(repositories);
      const tags = this.generateTags(repositories, recipeType);
      const instructions = this.generateInstructions(repositories);
      const prerequisites = this.generatePrerequisites(repositories);

      return {
        name,
        description,
        useCase,
        repositories,
        compatibilityScore,
        setupComplexity,
        estimatedSetupTime,
        synergyBenefits,
        tags,
        instructions,
        prerequisites
      };
    } catch (error) {
      console.error('Error creating recipe:', error);
      return null;
    }
  }

  /**
   * Filter repositories by focus area
   */
  private filterRepositoriesByFocus(repositories: Repository[], focusArea: string): Repository[] {
    const focusKeywords: Record<string, string[]> = {
      'ai-ml': ['machine learning', 'neural', 'deep learning', 'tensorflow', 'pytorch', 'ai', 'ml'],
      'web-dev': ['web', 'react', 'vue', 'angular', 'node', 'express', 'django', 'flask'],
      'data-science': ['data', 'analytics', 'pandas', 'numpy', 'jupyter', 'visualization'],
      'devops': ['docker', 'kubernetes', 'ci/cd', 'deployment', 'infrastructure'],
      'mobile': ['ios', 'android', 'react native', 'flutter', 'mobile'],
      'blockchain': ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'web3'],
      'game-dev': ['game', 'unity', 'unreal', 'graphics'],
      'security': ['security', 'encryption', 'auth', 'vulnerability']
    };

    const keywords = focusKeywords[focusArea.toLowerCase()] || [];
    if (keywords.length === 0) return repositories;

    return repositories.filter(repo => {
      const text = `${repo.description} ${repo.topics.join(' ')}`.toLowerCase();
      return keywords.some(keyword => text.includes(keyword));
    });
  }

  /**
   * Calculate repository quality score
   */
  private calculateRepositoryQuality(repo: Repository): number {
    const starScore = Math.min(1.0, Math.log10(repo.stars + 1) / 5);
    const forkScore = Math.min(1.0, repo.forks / (repo.stars + 1) * 5);
    const recentScore = this.calculateRecencyScore(repo.updatedAt);
    const descriptionScore = repo.description && repo.description.length > 20 ? 1.0 : 0.5;

    return (starScore * 0.4 + forkScore * 0.2 + recentScore * 0.3 + descriptionScore * 0.1);
  }

  /**
   * Calculate recency score
   */
  private calculateRecencyScore(updatedAt: string): number {
    const now = new Date();
    const lastUpdate = new Date(updatedAt);
    const daysSince = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSince <= 30) return 1.0;
    if (daysSince <= 90) return 0.8;
    if (daysSince <= 180) return 0.6;
    if (daysSince <= 365) return 0.4;
    return 0.2;
  }

  /**
   * Generate repository combinations
   */
  private generateRepositoryCombinations(repositories: Repository[], minSize: number, maxSize: number): Repository[][] {
    const combinations: Repository[][] = [];

    for (let size = minSize; size <= Math.min(maxSize, repositories.length); size++) {
      const sizeCombos = this.getCombinations(repositories, size);
      combinations.push(...sizeCombos.slice(0, 10)); // Limit combinations per size
    }

    return combinations;
  }

  /**
   * Get combinations of repositories
   */
  private getCombinations<T>(array: T[], size: number): T[][] {
    if (size === 1) return array.map(item => [item]);
    if (size === array.length) return [array];
    if (size > array.length) return [];

    const combinations: T[][] = [];
    
    for (let i = 0; i <= array.length - size; i++) {
      const smallerCombinations = this.getCombinations(array.slice(i + 1), size - 1);
      for (const combo of smallerCombinations) {
        combinations.push([array[i], ...combo]);
      }
    }

    return combinations;
  }

  /**
   * Calculate combination compatibility
   */
  private calculateCombinationCompatibility(repositories: Repository[]): number {
    if (repositories.length < 2) return 1.0;

    let totalCompatibility = 0;
    let comparisons = 0;

    for (let i = 0; i < repositories.length; i++) {
      for (let j = i + 1; j < repositories.length; j++) {
        totalCompatibility += this.calculatePairCompatibility(repositories[i], repositories[j]);
        comparisons++;
      }
    }

    return comparisons > 0 ? totalCompatibility / comparisons : 0;
  }

  /**
   * Calculate compatibility between two repositories
   */
  private calculatePairCompatibility(repo1: Repository, repo2: Repository): number {
    // Language compatibility
    const lang1 = repo1.language;
    const lang2 = repo2.language;
    const langCompatible = lang1 === lang2 || this.areLanguagesCompatible(lang1, lang2);
    const langScore = langCompatible ? 1.0 : 0.5;

    // Domain compatibility (based on description similarity)
    const desc1 = repo1.description.toLowerCase();
    const desc2 = repo2.description.toLowerCase();
    const commonWords = this.findCommonWords(desc1, desc2);
    const domainScore = Math.min(1.0, commonWords / 3);

    // License compatibility
    const licenseScore = this.areLicensesCompatible(repo1.license, repo2.license);

    return (langScore * 0.4 + domainScore * 0.4 + licenseScore * 0.2);
  }

  /**
   * Check if languages are compatible
   */
  private areLanguagesCompatible(lang1: string, lang2: string): boolean {
    const compatibilityMap: Record<string, string[]> = {
      'Python': ['JavaScript', 'TypeScript', 'Go', 'Rust'],
      'JavaScript': ['TypeScript', 'Python', 'Go'],
      'TypeScript': ['JavaScript', 'Python'],
      'Go': ['Python', 'JavaScript', 'TypeScript'],
      'Rust': ['Python', 'Go', 'C++'],
      'Java': ['Kotlin', 'Scala', 'Python']
    };

    return compatibilityMap[lang1]?.includes(lang2) || false;
  }

  /**
   * Find common words between descriptions
   */
  private findCommonWords(desc1: string, desc2: string): number {
    const words1 = desc1.split(/\s+/).filter(w => w.length > 3);
    const words2 = desc2.split(/\s+/).filter(w => w.length > 3);
    
    const set2 = new Set(words2);
    return words1.filter(word => set2.has(word)).length;
  }

  /**
   * Check license compatibility
   */
  private areLicensesCompatible(license1?: string, license2?: string): number {
    if (!license1 || !license2) return 0.7;
    
    const permissive = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'BSD-2-Clause'];
    const copyleft = ['GPL-3.0', 'GPL-2.0', 'LGPL-3.0'];
    
    if (permissive.includes(license1) && permissive.includes(license2)) return 1.0;
    if (copyleft.includes(license1) && copyleft.includes(license2)) return 0.8;
    if (license1 === license2) return 1.0;
    
    return 0.5;
  }

  /**
   * Generate recipe name
   */
  private generateRecipeName(repositories: Repository[], type: string): string {
    const mainRepo = repositories.reduce((prev, current) => 
      current.stars > prev.stars ? current : prev
    );
    
    return `${type} with ${mainRepo.name}`;
  }

  /**
   * Generate recipe description
   */
  private generateRecipeDescription(repositories: Repository[], recipeType: any): string {
    const repoNames = repositories.map(r => r.name).join(', ');
    return `A comprehensive ${recipeType.name.toLowerCase()} setup combining ${repoNames} for enhanced development workflow and productivity.`;
  }

  /**
   * Generate use case
   */
  private generateUseCase(repositories: Repository[], recipeType: any): string {
    const useCases: Record<string, string> = {
      'Full Stack': 'Complete web application development with frontend, backend, and database components',
      'ML Pipeline': 'End-to-end machine learning workflow from data processing to model deployment',
      'Data Science Stack': 'Comprehensive data analysis and visualization platform',
      'DevOps Toolkit': 'Infrastructure automation and deployment pipeline',
      'Mobile Development': 'Cross-platform mobile application development'
    };

    return useCases[recipeType.name] || 'General development setup';
  }

  /**
   * Calculate setup complexity
   */
  private calculateSetupComplexity(repositories: Repository[]): 'simple' | 'moderate' | 'complex' {
    const complexityScore = repositories.length * 0.5 + 
      repositories.filter(r => ['C++', 'Rust', 'Go'].includes(r.language)).length * 0.3;
    
    if (complexityScore <= 1.5) return 'simple';
    if (complexityScore <= 3.0) return 'moderate';
    return 'complex';
  }

  /**
   * Estimate setup time
   */
  private estimateSetupTime(repositories: Repository[], complexity: string): string {
    const times: Record<string, string> = {
      'simple': '30 minutes - 1 hour',
      'moderate': '1-3 hours',
      'complex': '3-6 hours'
    };

    return times[complexity] || '1-3 hours';
  }

  /**
   * Identify synergy benefits
   */
  private identifySynergyBenefits(repositories: Repository[]): string[] {
    return [
      'Integrated development workflow',
      'Shared configuration and tooling',
      'Enhanced productivity through automation',
      'Consistent coding standards',
      'Streamlined deployment process'
    ];
  }

  /**
   * Generate tags
   */
  private generateTags(repositories: Repository[], recipeType: any): string[] {
    const tags = new Set<string>();
    
    // Add type tag
    tags.add(recipeType.name.toLowerCase().replace(' ', '-'));
    
    // Add language tags
    repositories.forEach(repo => {
      if (repo.language) tags.add(repo.language.toLowerCase());
    });
    
    // Add common topic tags
    repositories.forEach(repo => {
      repo.topics.forEach(topic => tags.add(topic));
    });
    
    return Array.from(tags).slice(0, 8);
  }

  /**
   * Generate setup instructions
   */
  private generateInstructions(repositories: Repository[]): RecipeInstruction[] {
    const instructions: RecipeInstruction[] = [
      {
        step: 1,
        title: 'Prerequisites Check',
        description: 'Ensure all required tools and dependencies are installed',
        notes: 'Check system requirements for each repository'
      },
      {
        step: 2,
        title: 'Clone Repositories',
        description: 'Clone all required repositories to your local machine',
        commands: repositories.map(repo => `git clone ${repo.url}`)
      },
      {
        step: 3,
        title: 'Install Dependencies',
        description: 'Install dependencies for each repository',
        commands: ['npm install', 'pip install -r requirements.txt', 'go mod download']
      },
      {
        step: 4,
        title: 'Configuration',
        description: 'Configure integration between repositories',
        notes: 'Update configuration files and environment variables'
      },
      {
        step: 5,
        title: 'Testing',
        description: 'Run tests to ensure everything is working correctly',
        commands: ['npm test', 'python -m pytest', 'go test ./...']
      }
    ];

    return instructions;
  }

  /**
   * Generate prerequisites
   */
  private generatePrerequisites(repositories: Repository[]): string[] {
    const prerequisites = new Set<string>();
    
    repositories.forEach(repo => {
      switch (repo.language) {
        case 'JavaScript':
        case 'TypeScript':
          prerequisites.add('Node.js 16+');
          prerequisites.add('npm or yarn');
          break;
        case 'Python':
          prerequisites.add('Python 3.8+');
          prerequisites.add('pip');
          break;
        case 'Go':
          prerequisites.add('Go 1.19+');
          break;
        case 'Rust':
          prerequisites.add('Rust 1.65+');
          prerequisites.add('Cargo');
          break;
        case 'Java':
          prerequisites.add('Java 11+');
          prerequisites.add('Maven or Gradle');
          break;
      }
    });
    
    prerequisites.add('Git');
    return Array.from(prerequisites);
  }

  /**
   * Update leaderboard
   */
  private async updateLeaderboard(): Promise<void> {
    const entries: LeaderboardEntry[] = this.recipes.map((recipe, index) => {
      const overallScore = this.calculateOverallScore(recipe);
      
      return {
        recipe,
        overallScore,
        rank: index + 1,
        trendingDirection: 'stable' as const,
        popularityTrend: this.calculatePopularityTrend(recipe),
        lastUpdated: new Date().toISOString()
      };
    });

    // Sort by overall score
    entries.sort((a, b) => b.overallScore - a.overallScore);
    
    // Update ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    this.leaderboard = entries;
  }

  /**
   * Calculate overall recipe score
   */
  private calculateOverallScore(recipe: Recipe): number {
    const repoQualityScore = recipe.repositories.reduce((sum, repo) => 
      sum + this.calculateRepositoryQuality(repo), 0) / recipe.repositories.length;
    
    const complexityPenalty = recipe.setupComplexity === 'simple' ? 1.0 : 
                             recipe.setupComplexity === 'moderate' ? 0.9 : 0.8;
    
    return recipe.compatibilityScore * 0.4 + repoQualityScore * 0.4 + complexityPenalty * 0.2;
  }

  /**
   * Calculate popularity trend
   */
  private calculatePopularityTrend(recipe: Recipe): number {
    const totalStars = recipe.repositories.reduce((sum, repo) => sum + repo.stars, 0);
    return Math.log10(totalStars + 1) / 6; // Normalize to 0-1
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 20, sortBy: string = 'overall_score'): Promise<LeaderboardEntry[]> {
    let sorted = [...this.leaderboard];

    switch (sortBy) {
      case 'compatibility_score':
        sorted.sort((a, b) => b.recipe.compatibilityScore - a.recipe.compatibilityScore);
        break;
      case 'stars':
        sorted.sort((a, b) => {
          const starsA = a.recipe.repositories.reduce((sum, r) => sum + r.stars, 0);
          const starsB = b.recipe.repositories.reduce((sum, r) => sum + r.stars, 0);
          return starsB - starsA;
        });
        break;
      case 'trending':
        sorted.sort((a, b) => b.popularityTrend - a.popularityTrend);
        break;
      default:
        sorted.sort((a, b) => b.overallScore - a.overallScore);
    }

    // Update ranks after sorting
    sorted.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return sorted.slice(0, limit);
  }
}
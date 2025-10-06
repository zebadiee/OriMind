import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface Recipe {
    name: string;
    description: string;
    useCase: string;
    repositories: Repository[];
    compatibilityScore: number;
    overallScore: number;
    setupComplexity: string;
    estimatedSetupTime: string;
    synergyBenefits: string[];
    tags: string[];
    rank: number;
    trending: string;
}

export interface Repository {
    fullName: string;
    url: string;
    stars: number;
    language: string;
    description: string;
}

export class RecipeProvider implements vscode.TreeDataProvider<Recipe | Repository> {
    private _onDidChangeTreeData: vscode.EventEmitter<Recipe | Repository | undefined | null | void> = new vscode.EventEmitter<Recipe | Repository | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Recipe | Repository | undefined | null | void> = this._onDidChangeTreeData.event;

    private recipes: Recipe[] = [];

    constructor(private context: vscode.ExtensionContext) {
        this.loadRecipes();
    }

    refresh(): void {
        this.loadRecipes();
        this._onDidChangeTreeData.fire();
    }

    hasRecipes(): boolean {
        return this.recipes.length > 0;
    }

    getTreeItem(element: Recipe | Repository): vscode.TreeItem {
        if ('repositories' in element) {
            // It's a Recipe
            const recipe = element as Recipe;
            const item = new vscode.TreeItem(recipe.name, vscode.TreeItemCollapsibleState.Collapsed);
            
            const trendingIcon = this.getTrendingIcon(recipe.trending);
            item.label = `${trendingIcon} ${recipe.name}`;
            item.description = `Score: ${recipe.overallScore.toFixed(3)}`;
            item.tooltip = new vscode.MarkdownString(`
**${recipe.name}**
- Score: ${recipe.overallScore.toFixed(3)}
- Use Case: ${recipe.useCase}
- Setup: ${recipe.setupComplexity}
- Repositories: ${recipe.repositories.length}
            `);
            
            item.command = {
                command: 'github-recipe-book.showRecipe',
                title: 'Show Recipe Details',
                arguments: [recipe]
            };

            return item;
        } else {
            // It's a Repository
            const repo = element as Repository;
            const item = new vscode.TreeItem(repo.fullName, vscode.TreeItemCollapsibleState.None);
            item.description = `${repo.stars}⭐ ${repo.language}`;
            item.tooltip = new vscode.MarkdownString(`
**${repo.fullName}**
- Stars: ${repo.stars}
- Language: ${repo.language}
- Description: ${repo.description}
            `);
            
            item.command = {
                command: 'vscode.open',
                title: 'Open Repository',
                arguments: [vscode.Uri.parse(repo.url)]
            };

            item.iconPath = new vscode.ThemeIcon('repo');
            return item;
        }
    }

    getChildren(element?: Recipe | Repository): Promise<(Recipe | Repository)[]> {
        if (!element) {
            // Return top-level recipes
            return Promise.resolve(this.recipes);
        } else if ('repositories' in element) {
            // Return repositories for a recipe
            const recipe = element as Recipe;
            return Promise.resolve(recipe.repositories);
        } else {
            // Repositories don't have children
            return Promise.resolve([]);
        }
    }

    private getTrendingIcon(trending: string): string {
        switch (trending) {
            case 'up': return '📈';
            case 'down': return '📉';
            case 'new': return '🆕';
            default: return '➡️';
        }
    }

    private async loadRecipes(): Promise<void> {
        try {
            const config = vscode.workspace.getConfiguration('github-recipe-book');
            const recipeBookPath = config.get<string>('recipeBookPath');
            
            if (!recipeBookPath) {
                this.recipes = [];
                return;
            }

            const leaderboardPath = path.join(recipeBookPath, 'recipe_leaderboard.json');
            
            if (!fs.existsSync(leaderboardPath)) {
                this.recipes = [];
                return;
            }

            const data = fs.readFileSync(leaderboardPath, 'utf8');
            const leaderboard = JSON.parse(data);
            
            this.recipes = leaderboard.slice(0, 20).map((entry: any, index: number) => {
                const recipe = entry.recipe;
                return {
                    name: recipe.name,
                    description: recipe.description,
                    useCase: recipe.use_case || recipe.useCase,
                    repositories: recipe.repositories.map((repo: any) => ({
                        fullName: repo.full_name || repo.fullName,
                        url: repo.url,
                        stars: repo.stars || 0,
                        language: repo.language || '',
                        description: repo.description || ''
                    })),
                    compatibilityScore: recipe.compatibility_score || recipe.compatibilityScore || 0,
                    overallScore: entry.overall_score || entry.overallScore || 0,
                    setupComplexity: recipe.setup_complexity || recipe.setupComplexity || 'moderate',
                    estimatedSetupTime: recipe.estimated_setup_time || recipe.estimatedSetupTime || '1-3 hours',
                    synergyBenefits: recipe.synergy_benefits || recipe.synergyBenefits || [],
                    tags: recipe.tags || [],
                    rank: index + 1,
                    trending: entry.trending_direction || entry.trendingDirection || 'stable'
                } as Recipe;
            });

        } catch (error) {
            console.error('Failed to load recipes:', error);
            this.recipes = [];
        }
    }
}
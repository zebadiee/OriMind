import * as vscode from 'vscode';
import { exec } from 'child_process';
import { RecipeProvider } from './recipeProvider';
import { RecipeWebviewProvider } from './recipeWebviewProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('GitHub Recipe Book extension is now active!');

    // Create providers
    const recipeProvider = new RecipeProvider(context);
    const recipeWebviewProvider = new RecipeWebviewProvider(context);

    // Register tree view
    const treeView = vscode.window.createTreeView('recipeExplorer', {
        treeDataProvider: recipeProvider,
        showCollapseAll: true
    });

    // Register webview provider
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            RecipeWebviewProvider.viewType,
            recipeWebviewProvider
        )
    );

    // Set context when recipes are available
    vscode.commands.executeCommand('setContext', 'github-recipe-book:hasRecipes', recipeProvider.hasRecipes());

    // Register commands
    const scanCommand = vscode.commands.registerCommand('github-recipe-book.scan', async () => {
        await runPythonScript('scan');
        recipeProvider.refresh();
        vscode.commands.executeCommand('setContext', 'github-recipe-book:hasRecipes', recipeProvider.hasRecipes());
    });

    const generateCommand = vscode.commands.registerCommand('github-recipe-book.generateRecipes', async () => {
        await runPythonScript('generate');
        recipeProvider.refresh();
        vscode.commands.executeCommand('setContext', 'github-recipe-book:hasRecipes', recipeProvider.hasRecipes());
    });

    const leaderboardCommand = vscode.commands.registerCommand('github-recipe-book.showLeaderboard', () => {
        recipeWebviewProvider.showLeaderboard();
    });

    const refreshCommand = vscode.commands.registerCommand('github-recipe-book.refreshRecipes', () => {
        recipeProvider.refresh();
        vscode.commands.executeCommand('setContext', 'github-recipe-book:hasRecipes', recipeProvider.hasRecipes());
    });

    const showRecipeCommand = vscode.commands.registerCommand('github-recipe-book.showRecipe', (recipe: any) => {
        recipeWebviewProvider.showRecipe(recipe);
    });

    // Add all commands to subscriptions
    context.subscriptions.push(
        scanCommand,
        generateCommand,
        leaderboardCommand,
        refreshCommand,
        showRecipeCommand,
        treeView
    );
}

async function runPythonScript(action: 'scan' | 'generate'): Promise<void> {
    return new Promise((resolve, reject) => {
        const config = vscode.workspace.getConfiguration('github-recipe-book');
        const pythonPath = config.get<string>('pythonPath', 'python');
        const recipeBookPath = config.get<string>('recipeBookPath');
        const maxVideos = config.get<number>('maxVideos', 30);
        const maxRecipes = config.get<number>('maxRecipes', 15);

        if (!recipeBookPath) {
            vscode.window.showErrorMessage('Recipe Book path not configured. Please set github-recipe-book.recipeBookPath in settings.');
            reject(new Error('Recipe Book path not configured'));
            return;
        }

        let command: string;
        let title: string;
        
        if (action === 'scan') {
            command = `"${pythonPath}" -c "
import sys
sys.path.append('${recipeBookPath}')
from recipe_scanner import GitHubRepoScanner
scanner = GitHubRepoScanner()
scanner.scan_channel('@manusagi', max_videos=${maxVideos})
print('Scan completed!')
"`;
            title = 'Scanning YouTube Channel...';
        } else {
            command = `"${pythonPath}" -c "
import sys
sys.path.append('${recipeBookPath}')
from recipe_generator import RecipeGenerator
generator = RecipeGenerator()
generator.generate_recipes(max_recipes=${maxRecipes})
print('Recipe generation completed!')
"`;
            title = 'Generating Recipes...';
        }

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: title,
            cancellable: false
        }, async () => {
            return new Promise<void>((progressResolve, progressReject) => {
                exec(command, { cwd: recipeBookPath }, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Command error: ${error}`);
                        vscode.window.showErrorMessage(`Failed to ${action}: ${error.message}`);
                        progressReject(error);
                        reject(error);
                    } else {
                        console.log(`Command output: ${stdout}`);
                        if (stderr) console.warn(`Command warnings: ${stderr}`);
                        vscode.window.showInformationMessage(`Successfully completed ${action}!`);
                        progressResolve();
                        resolve();
                    }
                });
            });
        });
    });
}

export function deactivate() {
    console.log('GitHub Recipe Book extension deactivated');
}
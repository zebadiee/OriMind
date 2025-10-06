import { Repository } from './github-scanner.js';

declare const console: any;

export interface CompatibilityScore {
  repository: Repository;
  languageCompatibility: number;
  domainCompatibility: number;
  licenseCompatibility: number;
  maintainabilityScore: number;
  popularityScore: number;
  overallScore: number;
  reasons: string[];
}

export interface CompatibilityMatrix {
  repositories: Repository[];
  scores: CompatibilityScore[];
  averageCompatibility: number;
  recommendedCombinations: Repository[][];
}

/**
 * Analyzes repository compatibility for recipe generation
 */
export class CompatibilityAnalyzer {
  private readonly languageCompatibilityMap: Record<string, string[]> = {
    'Python': ['JavaScript', 'TypeScript', 'Go', 'Rust', 'Java', 'C++'],
    'JavaScript': ['TypeScript', 'Python', 'Go', 'Rust', 'Java'],
    'TypeScript': ['JavaScript', 'Python', 'Go', 'Rust', 'Java'],
    'Go': ['Python', 'JavaScript', 'TypeScript', 'Rust', 'C++'],
    'Rust': ['Python', 'JavaScript', 'TypeScript', 'Go', 'C++'],
    'Java': ['Python', 'JavaScript', 'TypeScript', 'Kotlin', 'Scala'],
    'C++': ['Python', 'Go', 'Rust', 'C'],
    'C#': ['JavaScript', 'TypeScript', 'Python', 'F#'],
    'Ruby': ['Python', 'JavaScript', 'Go'],
    'PHP': ['JavaScript', 'Python', 'Go'],
    'Swift': ['Objective-C', 'JavaScript', 'Python'],
    'Kotlin': ['Java', 'JavaScript', 'Python']
  };

  private readonly domainKeywords: Record<string, string[]> = {
    'ai-ml': ['machine learning', 'neural network', 'deep learning', 'tensorflow', 'pytorch', 'scikit', 'keras', 'ai', 'ml', 'artificial intelligence'],
    'web-dev': ['web', 'react', 'vue', 'angular', 'node', 'express', 'django', 'flask', 'frontend', 'backend'],
    'data-science': ['data', 'analytics', 'pandas', 'numpy', 'jupyter', 'visualization', 'statistics', 'analysis'],
    'devops': ['docker', 'kubernetes', 'ci/cd', 'deployment', 'infrastructure', 'monitoring', 'logging'],
    'mobile': ['ios', 'android', 'react native', 'flutter', 'mobile', 'app'],
    'blockchain': ['blockchain', 'cryptocurrency', 'bitcoin', 'ethereum', 'smart contract', 'defi', 'web3'],
    'game-dev': ['game', 'unity', 'unreal', 'graphics', 'rendering', 'physics'],
    'security': ['security', 'encryption', 'authentication', 'vulnerability', 'penetration testing', 'cybersecurity']
  };

  /**
   * Analyze compatibility between repositories
   */
  async analyzeCompatibility(repositories: Repository[]): Promise<CompatibilityMatrix> {
    const scores: CompatibilityScore[] = [];

    for (const repo of repositories) {
      const score = await this.calculateRepositoryScore(repo, repositories);
      scores.push(score);
    }

    const averageCompatibility = scores.reduce((sum, score) => sum + score.overallScore, 0) / scores.length;
    const recommendedCombinations = this.findRecommendedCombinations(repositories, scores);

    return {
      repositories,
      scores,
      averageCompatibility,
      recommendedCombinations
    };
  }

  /**
   * Calculate compatibility score for a single repository
   */
  private async calculateRepositoryScore(repository: Repository, allRepositories: Repository[]): Promise<CompatibilityScore> {
    const languageCompatibility = this.calculateLanguageCompatibility(repository, allRepositories);
    const domainCompatibility = this.calculateDomainCompatibility(repository);
    const licenseCompatibility = this.calculateLicenseCompatibility(repository);
    const maintainabilityScore = this.calculateMaintainabilityScore(repository);
    const popularityScore = this.calculatePopularityScore(repository);

    const weights = {
      language: 0.25,
      domain: 0.20,
      license: 0.15,
      maintainability: 0.20,
      popularity: 0.20
    };

    const overallScore = 
      languageCompatibility * weights.language +
      domainCompatibility * weights.domain +
      licenseCompatibility * weights.license +
      maintainabilityScore * weights.maintainability +
      popularityScore * weights.popularity;

    const reasons = this.generateReasons(repository, {
      languageCompatibility,
      domainCompatibility,
      licenseCompatibility,
      maintainabilityScore,
      popularityScore
    });

    return {
      repository,
      languageCompatibility,
      domainCompatibility,
      licenseCompatibility,
      maintainabilityScore,
      popularityScore,
      overallScore,
      reasons
    };
  }

  /**
   * Calculate language compatibility score
   */
  private calculateLanguageCompatibility(repository: Repository, allRepositories: Repository[]): number {
    const repoLanguage = repository.language;
    if (!repoLanguage || repoLanguage === 'Unknown') return 0.5;

    const compatibleLanguages = this.languageCompatibilityMap[repoLanguage] || [];
    const otherLanguages = allRepositories
      .filter(r => r.url !== repository.url)
      .map(r => r.language)
      .filter(lang => lang && lang !== 'Unknown');

    if (otherLanguages.length === 0) return 0.8;

    const compatibleCount = otherLanguages.filter(lang => 
      compatibleLanguages.includes(lang) || lang === repoLanguage
    ).length;

    return Math.min(1.0, compatibleCount / otherLanguages.length + 0.2);
  }

  /**
   * Calculate domain compatibility score
   */
  private calculateDomainCompatibility(repository: Repository): number {
    const text = `${repository.description} ${repository.topics.join(' ')}`.toLowerCase();
    
    let maxDomainScore = 0;
    let domainMatches = 0;

    for (const [domain, keywords] of Object.entries(this.domainKeywords)) {
      const matches = keywords.filter(keyword => text.includes(keyword)).length;
      const domainScore = Math.min(1.0, matches / keywords.length * 2);
      
      if (domainScore > maxDomainScore) {
        maxDomainScore = domainScore;
      }
      
      if (matches > 0) {
        domainMatches++;
      }
    }

    // Bonus for being clearly categorized in a domain
    if (maxDomainScore > 0.3) {
      maxDomainScore = Math.min(1.0, maxDomainScore + 0.1);
    }

    return maxDomainScore;
  }

  /**
   * Calculate license compatibility score
   */
  private calculateLicenseCompatibility(repository: Repository): number {
    if (!repository.license) return 0.6; // Neutral score for unknown license

    const permissiveLicenses = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'BSD-2-Clause', 'ISC'];
    const copyleftLicenses = ['GPL-3.0', 'GPL-2.0', 'LGPL-3.0', 'LGPL-2.1', 'AGPL-3.0'];
    
    if (permissiveLicenses.includes(repository.license)) {
      return 1.0; // Highly compatible
    } else if (copyleftLicenses.includes(repository.license)) {
      return 0.7; // Moderately compatible
    } else {
      return 0.5; // Unknown compatibility
    }
  }

  /**
   * Calculate maintainability score
   */
  private calculateMaintainabilityScore(repository: Repository): number {
    const now = new Date();
    const lastUpdate = new Date(repository.updatedAt);
    const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);

    // Recently updated repositories score higher
    let recencyScore = 1.0;
    if (daysSinceUpdate > 365) {
      recencyScore = 0.3;
    } else if (daysSinceUpdate > 180) {
      recencyScore = 0.6;
    } else if (daysSinceUpdate > 90) {
      recencyScore = 0.8;
    }

    // Lower open issues relative to stars indicates better maintenance
    const issueRatio = repository.stars > 0 ? repository.openIssues / repository.stars : 1;
    const issueScore = Math.max(0.2, 1.0 - issueRatio * 10);

    // Repositories with documentation/readme score higher
    const hasDescription = repository.description && repository.description.length > 20;
    const descriptionScore = hasDescription ? 1.0 : 0.7;

    return (recencyScore * 0.4 + issueScore * 0.4 + descriptionScore * 0.2);
  }

  /**
   * Calculate popularity score
   */
  private calculatePopularityScore(repository: Repository): number {
    // Logarithmic scaling for stars (most repos have < 10k stars)
    const starScore = Math.min(1.0, Math.log10(repository.stars + 1) / 5);
    
    // Fork ratio indicates community engagement
    const forkRatio = repository.stars > 0 ? repository.forks / repository.stars : 0;
    const forkScore = Math.min(1.0, forkRatio * 5);
    
    return (starScore * 0.7 + forkScore * 0.3);
  }

  /**
   * Generate reasons for the compatibility score
   */
  private generateReasons(repository: Repository, scores: any): string[] {
    const reasons: string[] = [];

    if (scores.languageCompatibility > 0.8) {
      reasons.push(`Strong language ecosystem compatibility (${repository.language})`);
    } else if (scores.languageCompatibility < 0.4) {
      reasons.push(`Limited language compatibility with other repositories`);
    }

    if (scores.domainCompatibility > 0.7) {
      reasons.push('Clear domain focus with good keyword alignment');
    } else if (scores.domainCompatibility < 0.3) {
      reasons.push('Unclear domain focus or niche specialization');
    }

    if (scores.maintainabilityScore > 0.8) {
      reasons.push('Well-maintained with recent updates');
    } else if (scores.maintainabilityScore < 0.4) {
      reasons.push('May have maintenance concerns');
    }

    if (scores.popularityScore > 0.8) {
      reasons.push('High community adoption and engagement');
    } else if (scores.popularityScore < 0.3) {
      reasons.push('Limited community adoption');
    }

    if (repository.license && ['MIT', 'Apache-2.0'].includes(repository.license)) {
      reasons.push('Permissive license allows flexible usage');
    }

    return reasons;
  }

  /**
   * Find recommended combinations of repositories
   */
  private findRecommendedCombinations(repositories: Repository[], scores: CompatibilityScore[]): Repository[][] {
    const combinations: Repository[][] = [];
    const sortedRepos = scores
      .sort((a, b) => b.overallScore - a.overallScore)
      .map(s => s.repository);

    // Generate combinations of 2-4 repositories
    for (let size = 2; size <= Math.min(4, repositories.length); size++) {
      const combos = this.generateCombinations(sortedRepos.slice(0, 8), size);
      
      for (const combo of combos) {
        const avgScore = combo.reduce((sum, repo) => {
          const score = scores.find(s => s.repository.url === repo.url);
          return sum + (score?.overallScore || 0);
        }, 0) / combo.length;

        if (avgScore > 0.6) {
          combinations.push(combo);
        }
      }
    }

    return combinations.slice(0, 10); // Return top 10 combinations
  }

  /**
   * Generate combinations of repositories
   */
  private generateCombinations<T>(array: T[], size: number): T[][] {
    if (size === 1) return array.map(item => [item]);
    if (size === array.length) return [array];
    if (size > array.length) return [];

    const combinations: T[][] = [];
    
    for (let i = 0; i <= array.length - size; i++) {
      const smallerCombinations = this.generateCombinations(array.slice(i + 1), size - 1);
      for (const combo of smallerCombinations) {
        combinations.push([array[i], ...combo]);
      }
    }

    return combinations;
  }
}
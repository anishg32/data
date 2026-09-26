// Utility functions for DATATO

export function formatNumber(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toLocaleString();
}

export function formatCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    APP: '#6366f1',
    PRODUCT: '#f59e0b',
    MOVIE: '#ef4444',
    GAME: '#10b981',
    COMPANY: '#3b82f6',
    SERVICE: '#8b5cf6',
    WEBSITE: '#ec4899',
    TV_SHOW: '#f97316',
  };
  return colors[category] || '#6b7280';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    APP: 'App',
    PRODUCT: 'Product',
    MOVIE: 'Movie',
    GAME: 'Game',
    COMPANY: 'Company',
    SERVICE: 'Service',
    WEBSITE: 'Website',
    TV_SHOW: 'TV Show',
  };
  return labels[category] || category;
}

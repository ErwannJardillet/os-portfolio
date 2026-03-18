import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGitHubRepos } from './useGitHubRepos';
import { FALLBACK_REPOS } from '../constants';

// Simuler les variables d'environnement Vite
vi.stubEnv('VITE_GITHUB_USERNAME', 'test-user');

const mockRepos = [
  {
    name: 'mon-projet',
    description: 'Un super projet',
    html_url: 'https://github.com/test-user/mon-projet',
    stargazers_count: 5,
    forks_count: 2,
    updated_at: '2024-01-15T10:00:00Z',
    languages_url: 'https://api.github.com/repos/test-user/mon-projet/languages',
  },
];

const mockLanguages = { JavaScript: 12345, CSS: 6789 };

describe('useGitHubRepos', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv('VITE_GITHUB_USERNAME', 'test-user');
  });

  it('est en chargement au démarrage', () => {
    fetch.mockResolvedValue({ ok: true, json: async () => mockRepos });
    const { result } = renderHook(() => useGitHubRepos());
    expect(result.current.loading).toBe(true);
  });

  it('retourne des repos après un appel REST réussi', async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockRepos })
      .mockResolvedValueOnce({ ok: true, json: async () => mockLanguages });

    const { result } = renderHook(() => useGitHubRepos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.repos).toHaveLength(1);
    expect(result.current.repos[0].name).toBe('mon-projet');
    expect(result.current.repos[0].stars).toBe(5);
    expect(result.current.error).toBeNull();
  });

  it('utilise les repos fallback si l\'API est indisponible', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGitHubRepos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.repos).toEqual(FALLBACK_REPOS);
    expect(result.current.error).toBeNull();
  });

  it('utilise les repos fallback en cas de rate limit (403)', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      text: async () => 'rate limit exceeded',
    });

    const { result } = renderHook(() => useGitHubRepos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.repos).toEqual(FALLBACK_REPOS);
    expect(result.current.error).toBeNull();
  });

  it('retourne un tableau vide et une erreur si VITE_GITHUB_USERNAME est absent', async () => {
    vi.unstubAllEnvs();
    vi.stubEnv('VITE_GITHUB_USERNAME', '');

    const { result } = renderHook(() => useGitHubRepos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Sans username → erreur catchée → fallback
    expect(result.current.repos).toEqual(FALLBACK_REPOS);
  });

  it('termine avec loading à false dans tous les cas', async () => {
    fetch.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useGitHubRepos());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.loading).toBe(false);
  });
});

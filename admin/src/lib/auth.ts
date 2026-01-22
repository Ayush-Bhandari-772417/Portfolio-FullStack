// admin\src\lib\auth.ts
export const ACCESS_KEY = 'portfolio_access_token';
export const REFRESH_KEY = 'portfolio_refresh_token';

export function setTokens(access: string | null, refresh: string | null) {
  if (typeof window === 'undefined') return;
  if (access) localStorage.setItem(ACCESS_KEY, access);
  else localStorage.removeItem(ACCESS_KEY);

  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  else localStorage.removeItem(REFRESH_KEY);
}

export function getAccessToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null;
}

export function getRefreshToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null;
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

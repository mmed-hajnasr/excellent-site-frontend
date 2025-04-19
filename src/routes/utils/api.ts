import { goto } from "$app/navigation";

export async function authorizedFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!res.ok) {
    await goto(`/errors/${res.status}`); // Redirect to corresponding error page
    throw new Error(`HTTP ${res.status}`);
  }

  return res;
}

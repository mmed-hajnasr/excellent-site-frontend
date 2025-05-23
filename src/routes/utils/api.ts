import { browser } from "$app/environment";
import { goto } from "$app/navigation";

export const role_name: Record<number, string> = {
  1: 'Responsible',
  2: 'User',
  3: 'Admin',
};

export async function signIn(username: string, password: string) {
  if (!browser) return null;
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Store authentication data
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.user.username);
    localStorage.setItem('role', data.user.role_id);

    // Redirect to appropriate page based on role
    const redirectPath = data.role === 'admin' ? '/admin' : '/dashboard';
    await goto(redirectPath);

    return data;
  } catch (error) {
    console.error('Sign in failed:', error);
    throw error;
  }
}

export async function signOut() {
  if (!browser) return null;
  // Clear all auth-related data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');

  // Redirect to sign-in page
  await goto('/authentication/sign-in');
}

export async function authorizedFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  if (!token) {
    await goto('/authentication/sign-in');
    throw new Error('No authentication token found');
  }

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (res.status === 401) {
    // Token is invalid or expired
    await signOut();
    throw new Error('Session expired');
  }

  if (!res.ok) {
    await goto(`/errors/${res.status}`);
    throw new Error(`HTTP ${res.status}`);
  }

  return res;
}

// Helper function to get current user info
export function getCurrentUser() {
  if (!browser) return null;
  return {
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role'),
    isAuthenticated: !!localStorage.getItem('token')
  };
}

export async function handleSubmit(event: Event, endpoint: string) {
  if (!browser) return null;
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const payload = Object.fromEntries(formData.entries());

  try {
    endpoint = payload?.id ? `/${endpoint}/${payload.id}` : `/${endpoint}`;
    const method = payload?.id ? 'PUT' : 'POST';

    const response = await authorizedFetch(endpoint, {
      method,
      body: JSON.stringify(payload)
    });

    // Handle successful response
    const result = await response.json();
    console.log('Success:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

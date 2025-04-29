import { goto } from "$app/navigation";

interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export async function signIn(email: string, password: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: AuthResponse = await response.json();

    // Store authentication data
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);

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
  return {
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role'),
    isAuthenticated: !!localStorage.getItem('token')
  };

}
export async function handleSubmit(event: Event, endpoint: string) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  // Convert FormData to a plain object
  const payload = Object.fromEntries(formData.entries());

  try {
    endpoint = payload?.id ? `/${endpoint}/${payload.id}` : '/${endpoint}';
    const method = payload?.id ? 'PUT' : 'POST';

    const response = await authorizedFetch(endpoint, {
      method,
      body: JSON.stringify(payload)
    });

    // Handle successful response
    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

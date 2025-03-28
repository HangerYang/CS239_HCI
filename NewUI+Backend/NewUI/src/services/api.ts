const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type APIResponse<T> = {
  data: T | null;
  error: string | null;
};

async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return { data: null, error: error.detail || 'An error occurred' };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { data: null, error: 'Network error' };
  }
}

export async function sendChatMessage(
  username: string,
  message: string,
  scenario?: string,
  aiRole?: string
) {
  return fetchAPI<{response: string, audio_url: string}>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      username,
      message,
      scenario,
      ai_role: aiRole,
    }),
  });
}

export async function getSuggestions(username: string) {
  return fetchAPI<{suggestions: string[]}>('/api/suggestions', {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
}

export async function getLanguageLessons(username: string) {
  return fetchAPI<{critique: string, lessons: string[]}>('/api/lesson', {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
}

export async function setScenario(username: string, scenario: string, language?: string, description?: string, ai_role?: string) {
  // console.log("Calling setScenario with:", { username, scenario, language, description, ai_role})
  return fetchAPI<{scenario: string, ai_role: string}>('/api/scenario/set', {
    method: 'POST',
    body: JSON.stringify({ 
      username, 
      scenario,
      description: description || "default description",
      ai_role: ai_role || "assistant",
      language: language || "none"
    }),
  });
}

export async function getUserProfile(username: string) {
  return fetchAPI<any>(`/api/profile/${username}`);
}

export async function getDefaultScenarios() {
  return fetchAPI<any>('/api/scenarios');
}

export const createCustomScenario = async (
  username: string, 
  title: string, 
  description: string,
  ai_role: string,
  language?: string
) => {
  console.log("Calling createCustomScenario with:", { username, title, language, description, ai_role})
  try {
    const response = await fetch(`${API_BASE_URL}/api/scenario/set`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        scenario: title,  
        language: language || "none",
        ai_role,
        description
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        data: null,
        error: data.error || 'Failed to create custom scenario',
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: 'Network error, please try again',
    };
  }
};

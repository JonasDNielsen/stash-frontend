import { ApiResponse } from '@stash/shared';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new ApiError(
      data.error?.code || 'UNKNOWN_ERROR',
      response.status,
      data.error?.message || 'An error occurred'
    );
  }

  return data.data as T;
}

export async function createStash(
  title?: string,
  description?: string,
  slug?: string,
  password: string = ''
): Promise<{ id: string; slug: string; title: string | null; description: string | null }> {
  const response = await fetch(`${API_BASE}/stashes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title, description, slug, password }),
  });

  return handleResponse(response);
}

export async function getStash(slug: string): Promise<any> {
  const response = await fetch(`${API_BASE}/stashes/${slug}`, {
    credentials: 'include',
  });

  if (response.status === 404) {
    throw new ApiError('NOT_FOUND', 404, 'Stash not found');
  }

  return handleResponse(response);
}

export async function unlockStash(slug: string, password: string): Promise<{ token: string; slug: string }> {
  const response = await fetch(`${API_BASE}/stashes/${slug}/unlock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  });

  return handleResponse(response);
}

export async function addAsset(slug: string, asset: any): Promise<{ id: string; position: number }> {
  const response = await fetch(`${API_BASE}/stashes/${slug}/assets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ asset }),
  });

  return handleResponse(response);
}

export async function updateAsset(slug: string, assetId: string, asset: any): Promise<void> {
  const response = await fetch(`${API_BASE}/stashes/${slug}/assets/${assetId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ asset }),
  });

  await handleResponse(response);
}

export async function deleteAsset(slug: string, assetId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/stashes/${slug}/assets/${assetId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new ApiError('DELETE_FAILED', response.status, 'Failed to delete asset');
  }
}

export async function reorderAssets(slug: string, assetIds: string[]): Promise<void> {
  const response = await fetch(`${API_BASE}/stashes/${slug}/assets/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ assetIds }),
  });

  await handleResponse(response);
}

export async function reportStash(
  slug: string,
  reason: string,
  details?: string,
  contact?: string
): Promise<{ reportId: string }> {
  const response = await fetch(`${API_BASE}/stashes/${slug}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      reason,
      details,
      contact,
      attestation: true,
    }),
  });

  return handleResponse(response);
}

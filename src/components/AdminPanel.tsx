import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface QuarantinedStash {
  id: string;
  slug: string;
  title: string | null;
  status: string;
  report_count: number;
  last_reported_at: string | null;
}

export function AdminPanel() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [stashes, setStashes] = useState<QuarantinedStash[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Simple auth check (in production, use proper token exchange)
    if (password) {
      setIsAuthenticated(true);
      setPassword('');
      loadQueue();
    } else {
      setAuthError('Password required');
    }
  };

  const loadQueue = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/queue', {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load queue');
      }

      const data = await response.json();
      setStashes(data.data?.stashes || []);
    } catch (err) {
      setError('Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    if (!confirm('Restore this stash?')) return;

    try {
      const response = await fetch(`/api/admin/restore/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to restore');
      }

      // Reload queue
      await loadQueue();
    } catch (err) {
      setError('Failed to restore stash');
    }
  };

  const handleBlock = async (id: string) => {
    if (!confirm('Block this stash permanently?')) return;

    try {
      const response = await fetch(`/api/admin/block/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to block');
      }

      // Reload queue
      await loadQueue();
    } catch (err) {
      setError('Failed to block stash');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this stash permanently? This cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/stashes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      // Reload queue
      await loadQueue();
    } catch (err) {
      setError('Failed to delete stash');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container max-w-md py-12">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {authError && (
          <div className="alert alert-error mb-4">{authError}</div>
        )}

        <form onSubmit={handleAuthenticate} className="card">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Admin Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setStashes([]);
          }}
          className="btn btn-secondary"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-6">{error}</div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Quarantined Stashes ({stashes.length})
        </h2>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner" />
          </div>
        ) : stashes.length === 0 ? (
          <div className="empty-state">
            <p>No quarantined stashes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stashes.map((stash) => (
              <div key={stash.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {stash.title || stash.slug}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Slug: <code className="bg-gray-100 px-2 py-1 rounded">{stash.slug}</code>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Reports: {stash.report_count}
                    </p>
                    {stash.last_reported_at && (
                      <p className="text-sm text-gray-600 mt-1">
                        Last reported: {new Date(stash.last_reported_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {stash.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(stash.id)}
                    className="btn btn-secondary btn-sm flex-1"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleBlock(stash.id)}
                    className="btn btn-danger btn-sm flex-1"
                  >
                    Block
                  </button>
                  <button
                    onClick={() => handleDelete(stash.id)}
                    className="btn btn-danger btn-sm flex-1"
                  >
                    Delete
                  </button>
                  <a
                    href={`/${stash.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm flex-1"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => loadQueue()}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Refreshing...' : 'Refresh Queue'}
      </button>
    </div>
  );
}

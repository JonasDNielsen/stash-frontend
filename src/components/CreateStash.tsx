import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStash, ApiError } from '../lib/api';

export function CreateStash() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await createStash(
        formData.title || undefined,
        formData.description || undefined,
        formData.slug || undefined,
        formData.password
      );

      // Redirect to edit page
      navigate(`/edit/${result.slug}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create stash');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Create a New Stash</h1>

        {error && (
          <div className="alert alert-error mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label htmlFor="slug" className="form-label">
              Stash URL (optional)
            </label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">stash.co/</span>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="my-awesome-stash"
                className="form-input flex-1"
                pattern="^[a-z0-9]([a-z0-9-]{1,38}[a-z0-9])?$"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Leave blank to auto-generate. Only lowercase letters, numbers, and hyphens.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title (optional)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="My Awesome Collection"
              className="form-input"
              maxLength={120}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell people what this stash is about..."
              className="form-textarea"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Secure Your Stash</h2>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                You'll need this to edit your stash later
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Stash'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

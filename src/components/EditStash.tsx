import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStash, unlockStash, addAsset, deleteAsset, ApiError } from '../lib/api';

export function EditStash() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [stash, setStash] = useState<any>(null);
  const [error, setError] = useState('');
  const [assetType, setAssetType] = useState<'link' | 'image' | 'youtube' | 'text'>('link');
  const [assetUrl, setAssetUrl] = useState('');
  const [assetTitle, setAssetTitle] = useState('');

  useEffect(() => {
    if (slug) {
      loadStash();
    }
  }, [slug]);

  const loadStash = async () => {
    try {
      if (slug) {
        const data = await getStash(slug);
        setStash(data);
      }
    } catch (err) {
      setError('Failed to load stash');
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (slug) {
        await unlockStash(slug, password);
        setIsUnlocked(true);
        setError('');
      }
    } catch (err) {
      setError('Invalid password');
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (slug) {
        await addAsset(slug, {
          type: assetType,
          url: assetUrl || undefined,
          title: assetTitle || undefined,
        });
        setAssetUrl('');
        setAssetTitle('');
        await loadStash();
      }
    } catch (err) {
      setError('Failed to add asset');
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      if (slug) {
        await deleteAsset(slug, assetId);
        await loadStash();
      }
    } catch (err) {
      setError('Failed to delete asset');
    }
  };

  if (!slug) {
    return <div className="text-center py-8">Invalid stash</div>;
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6">Unlock Stash</h1>
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Stash</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {stash && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{stash.title || 'Untitled Stash'}</h2>
            <p className="text-gray-600">{stash.description}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Add Asset</h3>
          <form onSubmit={handleAddAsset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Type
              </label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="link">Link</option>
                <option value="image">Image</option>
                <option value="youtube">YouTube</option>
                <option value="text">Text</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="text"
                value={assetUrl}
                onChange={(e) => setAssetUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={assetTitle}
                onChange={(e) => setAssetTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Asset title"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Asset
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

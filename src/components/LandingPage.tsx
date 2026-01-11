import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Stash
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create, share, and organize your favorite links and content in beautiful collections
          </p>
          <Link
            to="/create"
            className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Create Your First Stash
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">📦 Organize</h3>
            <p className="text-gray-600">
              Collect links, images, videos, and text in one beautiful place
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">🔗 Share</h3>
            <p className="text-gray-600">
              Share your collections with a simple URL. Perfect for portfolios and curations
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">🔒 Control</h3>
            <p className="text-gray-600">
              Protect your stash with a password. Edit anytime, anywhere
            </p>
          </div>
        </div>

        <div className="mt-16 card bg-blue-50">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Support for YouTube videos, images, links, and text blocks</li>
            <li>✓ Drag-and-drop reordering</li>
            <li>✓ Automatic link preview with metadata</li>
            <li>✓ Password-protected editing</li>
            <li>✓ SEO-friendly public pages</li>
            <li>✓ Mobile responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

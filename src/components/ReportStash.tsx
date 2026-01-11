import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportStash, ApiError } from '../lib/api';

export function ReportStash() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (slug) {
        await reportStash(slug, {
          reason,
          details: details || undefined,
          contact: contact || undefined,
        });
        setSuccess(true);
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      setError('Failed to submit report');
    }
  };

  if (!slug) {
    return <div className="text-center py-8">Invalid stash</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Report Stash</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            Report submitted successfully. Thank you!
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select a reason</option>
              <option value="spam">Spam</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="harassment">Harassment</option>
              <option value="copyright">Copyright Violation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-y"
              placeholder="Provide additional details"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email (optional)
            </label>
            <input
              type="email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

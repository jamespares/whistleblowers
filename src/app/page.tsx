'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { encryptData, generateAnonymousId } from '@/lib/encryption';

export default function Home() {
  const [formData, setFormData] = useState({
    department: '',
    description: '',
    evidence: '',
    severity: 'medium',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const reportId = generateAnonymousId();
      const encryptedReport = encryptData(JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('reports')
        .insert([
          {
            id: reportId,
            encrypted_content: encryptedReport,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      setMessage('Report submitted successfully. Your report ID is: ' + reportId);
      setFormData({ department: '', description: '', evidence: '', severity: 'medium' });
    } catch (error) {
      setMessage('Error submitting report. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl text-gray-800 font-bold mb-8 text-center">whistleblowers.io</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <p className="text-gray-600 mb-4">
            This platform allows you to securely and anonymously report corruption or incompetence.
            All submissions are encrypted end-to-end and your identity is protected. All serious reports will be forwarded to the relevant regulatory bodies for investigation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Department/Area</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description of Issue</label>
            <textarea
              className="w-full p-2 border rounded h-32"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Evidence (Optional)</label>
            <textarea
              className="w-full p-2 border rounded h-24"
              value={formData.evidence}
              onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
              placeholder="Provide any relevant evidence or documentation"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Severity Level</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>

          {message && (
            <div className={`mt-4 p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

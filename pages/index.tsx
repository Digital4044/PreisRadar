import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setResult(data.message || 'Keine Daten erhalten.');
    } catch (error) {
      setResult('Fehler beim Abrufen der Daten.');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">PreisRadar</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-6 rounded-xl shadow">
        <label className="block mb-2 font-medium">AutoScout24-Link eingeben:</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.autoscout24.ch/..."
          required
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Wird überprüft...' : 'Jetzt überprüfen'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow max-w-xl w-full whitespace-pre-wrap">
          {result}
        </div>
      )}
    </main>
  );
}

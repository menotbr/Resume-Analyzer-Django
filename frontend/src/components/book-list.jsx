import React, { useEffect, useState } from 'react';

const API_URL = "http://127.0.0.1:8000/api";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", published_date: "" });
  const [editingId, setEditingId] = useState(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadBooks = (opts = {}) => {
    setLoading(true);
    const qp = new URLSearchParams();
    const query = opts.q !== undefined ? opts.q : q;
    const pg = opts.page !== undefined ? opts.page : page;

    if (query) qp.set("q", query);
    if (pg) qp.set("page", pg);

    fetch(`${API_URL}/books/?${qp.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
          setCount(data.length);
          setNext(null);
          setPrevious(null);
        } else {
          setBooks(data.results || []);
          setCount(data.count);
          setNext(data.next);
          setPrevious(data.previous);
        }
      })
      .catch((err) => console.error("Error loading books:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBooks({ page: 1 });
  }, [q]);

  const handleCreate = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${API_URL}/books/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    .then((res) => res.json())
    .then((data) => {
      setForm({ title: "", author: "", published_date: "" });
      loadBooks({ page: 1 });
    })
    .catch((err) => console.error("Error creating book:", err))
    .finally(() => setLoading(false));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${API_URL}/books/${editingId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    .then((res) => res.json())
    .then(() => {
      setEditingId(null);
      setForm({ title: "", author: "", published_date: "" });
      loadBooks();
    })
    .catch((err) => console.error("Error updating book:", err))
    .finally(() => setLoading(false));
  };

  const startEdit = (b) => {
    setEditingId(b.id);
    setForm({ title: b.title, author: b.author, published_date: b.published_date });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", author: "", published_date: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setLoading(true);
      fetch(`${API_URL}/books/${id}/`, { method: "DELETE" })
      .then(() => loadBooks())
      .catch((err) => console.error("Error deleting book:", err))
      .finally(() => setLoading(false));
    }
  };

  const goPrev = () => {
    if (!previous) return;
    const params = new URL(previous).searchParams;
    const pg = parseInt(params.get("page") || "1", 10);
    setPage(pg);
    loadBooks({ page: pg });
  };

  const goNext = () => {
    if (!next) return;
    const params = new URL(next).searchParams;
    const pg = parseInt(params.get("page") || "1", 10);
    setPage(pg);
    loadBooks({ page: pg });
  };

  const doSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadBooks({ page: 1, q });
  };

  const handleFormSubmit = editingId ? handleUpdate : handleCreate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              📚 BookList Manager
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Organize your literary collection with our modern, intuitive book management system
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🔍</span>
              <h2 className="text-xl font-semibold text-gray-800">Search Your Library</h2>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by title, author, or keywords..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      doSearch(e);
                    }
                  }}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-white/90"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <span className="text-gray-400">⌘K</span>
                </div>
              </div>
              <button
                onClick={doSearch}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "🔄" : "Search"}
              </button>
              {q && (
                <button
                  onClick={() => {
                    setQ("");
                    setPage(1);
                  }}
                  className="px-6 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Book Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">{editingId ? "✏️" : "➕"}</span>
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Edit Book" : "Add New Book"}
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    📖 Book Title
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-white/90"
                    placeholder="Enter book title..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    👤 Author Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-white/90"
                    placeholder="Enter author name..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    📅 Publication Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.published_date}
                    onChange={(e) => setForm({ ...form, published_date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-white/90"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleFormSubmit}
                  disabled={!form.title || !form.author || !form.published_date || loading}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-100 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "🔄 Processing..." : editingId ? "✅ Update Book" : "➕ Add Book"}
                </button>
                
                {editingId && (
                  <button
                    onClick={cancelEdit}
                    className="px-8 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                  >
                    ❌ Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📊</span>
            <p className="text-lg font-medium text-gray-700">
              {count > 0 ? (
                <>
                  Showing <span className="font-bold text-indigo-600">{books.length}</span> of{' '}
                  <span className="font-bold text-indigo-600">{count}</span> books
                </>
              ) : (
                <span className="text-gray-500">No books found</span>
              )}
              {q && (
                <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                  "{q}"
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Page</span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full font-semibold">
              {page}
            </span>
          </div>
        </div>

        {/* Books List */}
        {loading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🔄</div>
            <p className="text-xl text-gray-600">Loading your books...</p>
          </div>
        ) : books.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      📖 Title
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      👤 Author
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      📅 Published
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      ⚙️ Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {books.map((book, index) => (
                    <tr 
                      key={book.id} 
                      className={`hover:bg-indigo-50/50 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                      }`}
                    >
                      <td className="px-8 py-6">
                        <div className="text-lg font-semibold text-gray-900">{book.title}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-lg text-gray-700">{book.author}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-lg text-gray-700">
                          {new Date(book.published_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => startEdit(book)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center">
            <div className="text-8xl mb-6">📚</div>
            <div className="text-2xl font-bold text-gray-500 mb-3">
              {q ? "No matching books found" : "Your library is empty"}
            </div>
            <div className="text-lg text-gray-400 max-w-md mx-auto">
              {q 
                ? `No books match "${q}". Try adjusting your search terms or browse all books.`
                : "Start building your collection by adding your first book using the form above."
              }
            </div>
          </div>
        )}

        {/* Pagination */}
        {(next || previous) && (
          <div className="mt-8 flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
              <div className="flex items-center space-x-6">
                <button
                  onClick={goPrev}
                  disabled={!previous || loading}
                  className={`px-6 py-3 text-lg font-medium rounded-xl transition-all duration-200 ${
                    previous && !loading
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  ← Previous
                </button>
                
                <div className="flex items-center space-x-4">
                  <span className="text-lg text-gray-600">Page</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg">
                    {page}
                  </span>
                  <span className="text-lg text-gray-600">of many</span>
                </div>
                
                <button
                  onClick={goNext}
                  disabled={!next || loading}
                  className={`px-6 py-3 text-lg font-medium rounded-xl transition-all duration-200 ${
                    next && !loading
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
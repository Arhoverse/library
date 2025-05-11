import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
      setQuery('')
    }
  }

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-3xl font-bold text-blue-600">📚 Bibliothèque</Link>
          <Link to="/" className="text-gray-700 hover:text-blue-600 text-lg">Accueil</Link>
          <Link to="/search?q=" className="text-gray-700 hover:text-blue-600 text-lg">Rechercher un livre</Link>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-2 rounded-md"
            placeholder="Rechercher un livre..."
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Rechercher</button>
        </form>
      </div>
    </header>
  )
}

export default Header

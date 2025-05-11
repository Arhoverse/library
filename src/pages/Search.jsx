import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Search() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1) 
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState('') 
  const location = useLocation()
  const navigate = useNavigate()

  const resultsPerPage = 9 
  const offset = (currentPage - 1) * resultsPerPage

  useEffect(() => {

    const searchQuery = new URLSearchParams(location.search).get('q') || ''
    setQuery(searchQuery)
    
    if (!searchQuery) return
    setLoading(true)

    axios.get(`https://openlibrary.org/search.json?q=${searchQuery}&limit=${resultsPerPage}&offset=${offset}`)
      .then(res => {
        setBooks(res.data.docs)
        setTotalPages(Math.ceil(res.data.num_found / resultsPerPage)) 
      })
      .catch(err => console.error('Erreur recherche', err))
      .finally(() => setLoading(false))
  }, [location.search, currentPage]) 

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {

      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div>

      <form onSubmit={handleSearch} className="mb-6 flex justify-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Mettre à jour la valeur de la requête
          className="border p-2 rounded w-1/3"
          placeholder="Rechercher un livre..."
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded ml-2">
          Rechercher
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Résultats pour : {query}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.key} className="bg-white p-4 rounded shadow hover:shadow-lg">
            <div className="flex flex-col items-center">

              {book.cover_i && (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                  className="w-32 h-48 object-cover mb-4"
                />
              )}
              <h3 className="text-lg font-semibold text-center">
                <Link to={`/book${book.key}`} className="text-blue-600 hover:underline">
                  {book.title}
                </Link>
              </h3>
              <p className="text-gray-600">{book.author_name?.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-black rounded mr-2 disabled:bg-gray-300"
        >
          Précédent
        </button>

        <span className="self-center text-lg">
          Page {currentPage} sur {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-black rounded ml-2 disabled:bg-gray-300"
        >
          Suivant
        </button>
      </div>
    </div>
  )
}

export default Search

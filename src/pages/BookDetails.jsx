import { useEffect, useState } from 'react'
import axios from 'axios'

function BookDetails() {
  const [book, setBook] = useState(null)
  const [wiki, setWiki] = useState(null)
  const [loading, setLoading] = useState(true)

  const { pathname } = window.location
  const bookId = pathname.replace('/book', '') 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://openlibrary.org${bookId}.json`)
        setBook(res.data)

        // Wikipédia
        try {
          const wikiRes = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(res.data.title)}`
          )
          setWiki(wikiRes.data)
        } catch {
        }

      } catch (err) {
        console.error('Erreur récupération livre :', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [bookId])

  if (loading) return <div className="text-center mt-8">Chargement...</div>
  if (!book) return <div className="text-center text-red-600 mt-8">Livre non trouvé.</div>

  const coverId = book.covers?.[0]
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md mt-6">
      <div className="flex flex-col md:flex-row gap-6">
        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Couverture de ${book.title}`}
            className="w-60 h-auto object-cover rounded"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">{book.title}</h1>
          
          {book.authors && (
            <p className="text-gray-700 mb-1">
              <strong>Auteur(s) :</strong> {book.authors.map(a => a.name).join(', ')}
            </p>
          )}

          {book.first_publish_date && (
            <p className="text-gray-700 mb-1">
              <strong>Date de première publication :</strong> {book.first_publish_date}
            </p>
          )}

          {book.subjects && (
            <p className="text-gray-700 mb-3">
              <strong>Sujets :</strong> {book.subjects.slice(0, 5).join(', ')}
            </p>
          )}

          {book.description && (
            <p className="text-gray-800 mt-2">
              {typeof book.description === 'string'
                ? book.description
                : book.description?.value}
            </p>
          )}

          <a
            href={`https://openlibrary.org${bookId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-blue-600 underline"
          >
            Voir sur OpenLibrary
          </a>
        </div>
      </div>

      {wiki && (
        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Résumé Wikipédia</h2>
          <p className="text-gray-700 mb-2">{wiki.extract}</p>
          {wiki.content_urls?.desktop?.page && (
            <a
              href={wiki.content_urls.desktop.page}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Lire l'article complet sur Wikipédia
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default BookDetails

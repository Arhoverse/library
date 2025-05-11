import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Home() {
  const [recentChanges, setRecentChanges] = useState([])

  useEffect(() => {
    axios
      .get('https://openlibrary.org/recentchanges.json?limit=10')
      .then((res) => setRecentChanges(res.data))
      .catch((err) =>
        console.error('Erreur chargement changements récents', err)
      )
  }, [])

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-6">
          📚 Bienvenue à la Bibliothèque
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
          Explorez des milliers de livres, découvrez des auteurs, et suivez les dernières mises à jour du catalogue.
        </p>
        <Link
          to="/search?q="
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg transition shadow-lg"
        >
          🔍 Commencer la recherche
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          🕒 Derniers changements dans la bibliothèque
        </h2>

        <ul className="space-y-6">
          {recentChanges.map((change, index) => (
            <li
              key={index}
              className="bg-gray-50 rounded-xl border border-gray-200 p-6 shadow hover:shadow-md transition"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-800 font-semibold">
                    📘 Type : {change.type}
                  </p>
                  {change.data?.title && (
                    <p className="text-gray-700">
                      📖 <span className="font-medium">Titre</span> : {change.data.title}
                    </p>
                  )}
                  {change.data?.key && (
                    <p className="text-gray-600">
                      🔗 <a
                        href={`https://openlibrary.org${change.data.key}`}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voir le document
                      </a>
                    </p>
                  )}
                </div>

                <div className="text-right md:text-left">
                  <p className="text-gray-600">
                    ⏰ {new Date(change.timestamp).toLocaleString()}
                  </p>
                  {change.author?.key && (
                    <p className="text-gray-500">
                      🙍 Auteur : {change.author.key}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Home

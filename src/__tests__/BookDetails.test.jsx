// src/__tests__/BookDetails.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { BrowserRouter as Router } from 'react-router-dom'
import BookDetails from '../pages/BookDetails'

describe('BookDetails', () => {
  const mock = new MockAdapter(axios)

  const mockBookData = {
    title: "Harry Potter and the Sorcerer's Stone",
    authors: [{ name: 'J.K. Rowling' }],
    first_publish_date: '1997-06-26',
    subjects: ['Fantasy', 'Magic', 'Adventure'],
    description: {
      value: 'A young wizard embarks on an adventure to learn magic and battle evil forces.'
    },
    covers: [12345]
  }

  const mockWikiData = {
    extract: 'Harry Potter is a fictional character and the protagonist of the book series.',
    content_urls: {
      desktop: {
        page: 'https://en.wikipedia.org/wiki/Harry_Potter'
      }
    }
  }

  beforeEach(() => {
    mock.reset()

    mock.onGet('https://openlibrary.org/works/OL12345W.json').reply(200, mockBookData)
    mock.onGet('https://en.wikipedia.org/api/rest_v1/page/summary/Harry_Potter_and_the_Sorcerer%27s_Stone').reply(200, mockWikiData)
  })

  test('affiche un message de chargement pendant la récupération des données', () => {
    render(
      <Router>
        <BookDetails />
      </Router>
    )

    expect(screen.getByText(/Chargement.../i)).toBeInTheDocument()
  })

  test('affiche les informations du livre après récupération des données', async () => {
    render(
      <Router>
        <BookDetails />
      </Router>
    )

    await waitFor(() => {
      expect(screen.getByText(/Harry Potter and the Sorcerer's Stone/i)).toBeInTheDocument()
      expect(screen.getByText(/J.K. Rowling/i)).toBeInTheDocument()
      expect(screen.getByText(/1997-06-26/i)).toBeInTheDocument()
      expect(screen.getByText(/Fantasy, Magic, Adventure/i)).toBeInTheDocument()
      expect(screen.getByText(/A young wizard embarks on an adventure to learn magic and battle evil forces./i)).toBeInTheDocument()
    })
  })

  test('affiche le lien vers OpenLibrary et Wikipédia', async () => {
    render(
      <Router>
        <BookDetails />
      </Router>
    )

    await waitFor(() => {
      expect(screen.getByText(/Voir sur OpenLibrary/i)).toHaveAttribute('href', 'https://openlibrary.org/works/OL12345W')

      expect(screen.getByText(/Lire l'article complet sur Wikipédia/i)).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Harry_Potter')
    })
  })

  test('affiche un message d\'erreur si le livre n\'est pas trouvé', async () => {
    mock.onGet('https://openlibrary.org/works/OL12345W.json').reply(404)

    render(
      <Router>
        <BookDetails />
      </Router>
    )

    await waitFor(() => {
      expect(screen.getByText(/Livre non trouvé./i)).toBeInTheDocument()
    })
  })
})

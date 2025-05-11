// src/__tests__/Search.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Search from '../pages/Search'
import axios from 'axios'
jest.mock('axios')

describe('Search', () => {
  test('affiche les résultats de la recherche', async () => {
    const mockData = {
      data: {
        docs: [
          { key: '/works/OL123456W', title: 'Book Title', author_name: ['Author Name'], cover_i: 12345 },
        ],
        num_found: 1,
      },
    }

    axios.get.mockResolvedValue(mockData)

    render(
      <Router>
        <Search />
      </Router>
    )


    fireEvent.change(screen.getByPlaceholderText(/Rechercher un livre.../i), { target: { value: 'Book Title' } })
    fireEvent.click(screen.getByText(/Rechercher/i))
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))
    expect(screen.getByText('Book Title')).toBeInTheDocument()
    expect(screen.getByText('Author Name')).toBeInTheDocument()
    expect(screen.getByAltText('Book Title')).toBeInTheDocument()
  })

  test('navigue correctement vers les pages suivantes et précédentes', async () => {
    const mockData = {
      data: {
        docs: [
          { key: '/works/OL123456W', title: 'Book Title', author_name: ['Author Name'], cover_i: 12345 },
        ],
        num_found: 25,
      },
    }

    axios.get.mockResolvedValue(mockData)

    render(
      <Router>
        <Search />
      </Router>
    )

    fireEvent.change(screen.getByPlaceholderText(/Rechercher un livre.../i), { target: { value: 'Book Title' } })
    fireEvent.click(screen.getByText(/Rechercher/i))

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))

    const nextButton = screen.getByText('Suivant')
    fireEvent.click(nextButton)
    expect(screen.getByText('Page 2 sur 3')).toBeInTheDocument()

    const prevButton = screen.getByText('Précédent')
    fireEvent.click(prevButton)
    expect(screen.getByText('Page 1 sur 3')).toBeInTheDocument()
  })

  test('affiche "Chargement..." pendant la récupération des données', async () => {
    axios.get.mockResolvedValue({
      data: { docs: [], num_found: 0 },
    })

    render(
      <Router>
        <Search />
      </Router>
    )

    fireEvent.change(screen.getByPlaceholderText(/Rechercher un livre.../i), { target: { value: 'Book Title' } })
    fireEvent.click(screen.getByText(/Rechercher/i))

    expect(screen.getByText('Chargement...')).toBeInTheDocument()

    await waitFor(() => expect(screen.getByText('Book Title')).toBeInTheDocument())
  })
})

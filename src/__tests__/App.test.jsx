// src/__tests__/App.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import App from '../App'

describe('App', () => {
  test('affiche la page d\'accueil', () => {
    render(
      <Router>
        <App />
      </Router>
    )

    expect(screen.getByText(/Bienvenue dans notre bibliothèque/i)).toBeInTheDocument()
  })

  test('navigue vers la page de recherche', async () => {
    render(
      <Router>
        <App />
      </Router>
    )

    const searchLink = screen.getByText(/Commencer la recherche/i)
    fireEvent.click(searchLink)

    await waitFor(() => {
      expect(screen.getByText(/Résultats pour :/)).toBeInTheDocument()
    })
  })

  test('navigue vers la page de détails d\'un livre', async () => {
    render(
      <Router>
        <App />
      </Router>
    )

    const bookLink = screen.getByText(/Détails du livre/i)
    fireEvent.click(bookLink)

    await waitFor(() => {
      expect(screen.getByText(/Informations sur le livre/i)).toBeInTheDocument()
    })
  })
})

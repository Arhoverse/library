// src/__tests__/Header.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from '../components/Header'
import { createMemoryHistory } from 'history'
import { Router as CustomRouter } from 'react-router'

describe('Header', () => {
  test('affiche le champ de recherche et réinitialise après soumission', () => {
    render(
      <Router>
        <Header />
      </Router>
    )


    const input = screen.getByPlaceholderText(/Rechercher un livre.../i)
    const button = screen.getByRole('button', { name: /Rechercher/i })


    fireEvent.change(input, { target: { value: 'Harry Potter' } })
    expect(input.value).toBe('Harry Potter')


    fireEvent.click(button)

    expect(window.location.href).toContain('/search?q=Harry%20Potter')

    expect(input.value).toBe('')
  })

  test('les liens de navigation fonctionnent', () => {
    const history = createMemoryHistory()
    render(
      <CustomRouter history={history}>
        <Header />
      </CustomRouter>
    )

    fireEvent.click(screen.getByText(/Accueil/i))
    expect(history.location.pathname).toBe('/')

    fireEvent.click(screen.getByText(/Rechercher un livre/i))
    expect(history.location.pathname).toBe('/search?q=')
  })
})

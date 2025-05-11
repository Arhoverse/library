import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'  // Ajouter la page d'accueil
import Search from './pages/Search'
import BookDetails from './pages/BookDetails'

function App() {
  return (
    <Router>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/search" element={<Search />} /> 
          <Route path="/book/*" element={<BookDetails />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

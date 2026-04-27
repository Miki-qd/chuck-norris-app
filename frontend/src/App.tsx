// App.tsx
import { useState } from 'react'
// 1. IMPORTUJEMY NASZ PLIK CSS
import './App.css' 

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const wyslijDane = (e: React.FormEvent) => {
    e.preventDefault()
    
    const daneDoWyslania = {
      email: email,
      password: password
    }

    fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(daneDoWyslania)
    })
    .then(response => {
      if (response.ok) {
        alert("Super! Użytkownik dodany do bazy.")
      } else {
        alert("Błąd! Prawdopodobnie taki email już istnieje w bazie.")
      }
    })
  }

  return (
    // 2. UŻYWAMY KLAS ZAMIAST INLINE STYLES
    <div className="app-container">
      <h2 className="title">Rejestracja Użytkownika</h2>
      
      <form onSubmit={wyslijDane} className="register-form">
        <input 
          className="register-input"
          type="email" 
          placeholder="Twój adres email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input 
          className="register-input"
          type="password" 
          placeholder="Twoje tajne hasło" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="submit-button">
          Zarejestruj się
        </button>
      </form>
    </div>
  )
}

export default App
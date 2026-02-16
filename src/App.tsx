import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="container">
        <h1>Unit Converter</h1>
        <p className="subtitle">Modern conversion tool</p>
        <div className="card">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="btn-primary"
          >
            Count is {count}
          </button>
          <p className="hint">
            Project initialized successfully!
          </p>
        </div>
      </div>
    </>
  )
}

export default App

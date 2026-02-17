import { ArrowRightLeft } from 'lucide-react';
import { ConverterCard } from './components';
import './App.css';

/**
 * Main App component with header, centered ConverterCard, and footer
 */
function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="app__header">
        <div className="app__header-content">
          <div className="app__logo">
            <ArrowRightLeft className="app__logo-icon" aria-hidden="true" />
            <h1 className="app__title">Unit Converter</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app__main">
        <div className="app__container">
          <ConverterCard />
        </div>
      </main>

      {/* Footer */}
      <footer className="app__footer">
        <p className="app__footer-text">
          Unit Converter v1.0 — Built with React + Vite
        </p>
      </footer>
    </div>
  );
}

export default App;

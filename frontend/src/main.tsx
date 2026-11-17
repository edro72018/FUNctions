import { createRoot } from 'react-dom/client';
import App from './App';
import './app/global.css';

const container = document.getElementById('root');

if (container === null) {
  throw new Error('No se encontró el contenedor #root');
}

createRoot(container).render(<App />);

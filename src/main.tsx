import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './store/authStore'

createRoot(document.getElementById("root")!).render(<App />);

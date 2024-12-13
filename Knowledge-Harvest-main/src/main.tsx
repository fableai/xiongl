import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './extension'
import './style.less'

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
        <App />
    // </React.StrictMode>,
)

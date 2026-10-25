import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  SceneProvider,
  AudioProvider,
  TimeProvider,
  FullscreenProvider,
  PreloadProvider,
} from './context'
import { registerServiceWorker } from './services/serviceWorkerRegistration'

// Register background caching service worker
registerServiceWorker();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PreloadProvider>
      <FullscreenProvider>
        <TimeProvider>
          <AudioProvider>
            <SceneProvider>
              <App />
            </SceneProvider>
          </AudioProvider>
        </TimeProvider>
      </FullscreenProvider>
    </PreloadProvider>
  </StrictMode>,
)

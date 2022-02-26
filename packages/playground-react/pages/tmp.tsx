import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FocusTrap } from '@headlessui/react'

function Window({ onClose, children }: { onClose: () => void; children: (window: Window) => any }) {
  const newWindow = useMemo(() => window.open('', 'window', 'width=300'), [])

  const [_, _forceUpdate] = useState({})
  const forceUpdate = useCallback(() => _forceUpdate({}), [])

  useEffect(() => {
    if (newWindow) return () => newWindow.close()
  }, [newWindow])

  useEffect(() => {
    if (newWindow) {
      newWindow.addEventListener('beforeunload', onClose)
      newWindow.addEventListener('load', forceUpdate)

      return () => {
        newWindow.removeEventListener('load', forceUpdate)
        newWindow.removeEventListener('beforeunload', onClose)
      }
    }

    // document is required to re-add these event listeners after initial
    // navigation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newWindow, newWindow?.document, onClose, forceUpdate])

  return newWindow ? createPortal(<>{children(newWindow)}</>, newWindow.document.body) : null
}

function FocusTrapper() {
  const [focusTrapped, setFocusTrapped] = useState(false)

  const contents = (
    <>
      <label>
        <input
          type="checkbox"
          checked={focusTrapped}
          onChange={(e) => setFocusTrapped(e.target.checked)}
        />
        Trap focus!
      </label>
      <button>Hello 1</button>
      <button>Hello 2</button>
      <button>Hello 3</button>
    </>
  )

  return focusTrapped ? <FocusTrap>{contents}</FocusTrap> : contents
}

export default function App() {
  const [windowOpen, setWindowOpen] = useState(false)
  const onWindowClose = useCallback(() => setWindowOpen(false), [])

  const windowRender = useCallback(
    () => (
      <>
        <FocusTrapper />
        <label>
          <input
            type="checkbox"
            checked={windowOpen}
            onChange={(e) => setWindowOpen(e.target.checked)}
          />
          Open window
        </label>
      </>
    ),
    [windowOpen]
  )

  return (
    <div className="App">
      <FocusTrapper />
      <div>
        <label>
          <input
            type="checkbox"
            checked={windowOpen}
            onChange={(e) => setWindowOpen(e.target.checked)}
          />
          Open window
        </label>
      </div>
      {windowOpen && <Window onClose={onWindowClose}>{windowRender}</Window>}
    </div>
  )
}

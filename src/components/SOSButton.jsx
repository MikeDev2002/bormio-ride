import { useState } from 'react'

export default function SOSButton() {
  const [open, setOpen] = useState(false)
  const [locating, setLocating] = useState(false)

  function sendSOS() {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`
        const message = encodeURIComponent(
          `🆘 SOS — I need help!\nMy location: ${mapsLink}\nPlease come to me or call emergency services.`
        )
        setLocating(false)
        setOpen(false)
        window.open(`https://wa.me/?text=${message}`, '_blank')
      },
      () => {
        // Fallback if GPS denied
        const message = encodeURIComponent(
          `🆘 SOS — I need help! I cannot share my location automatically. Please call me.`
        )
        setLocating(false)
        setOpen(false)
        window.open(`https://wa.me/?text=${message}`, '_blank')
      },
      { timeout: 8000, enableHighAccuracy: true }
    )
  }

  return (
    <>
      <button className="sos-btn" onClick={() => setOpen(true)} aria-label="SOS">
        SOS
      </button>

      {open && (
        <div className="sos-overlay" onClick={() => setOpen(false)}>
          <div className="sos-modal" onClick={e => e.stopPropagation()}>
            <h2>🆘 SOS Alert</h2>
            <p>
              This will get your GPS location and open WhatsApp with a pre-filled emergency message for the group.
            </p>
            <div className="sos-modal-btns">
              <button className="sos-confirm-btn" onClick={sendSOS} disabled={locating}>
                {locating ? 'Getting location…' : 'Send SOS via WhatsApp'}
              </button>
              <button className="sos-cancel-btn" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { authDataContext } from '../Context/AuthContext'
import { userDataContext } from '../Context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoNotificationsOutline } from 'react-icons/io5'

function NotificationBell() {
  const { serverUrl } = useContext(authDataContext)
  const { userData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)

  const fetchNotifications = async () => {
    if (!userData) return
    try {
      const res = await axios.get(`${serverUrl}/api/user/notifications`, { withCredentials: true })
      setNotifications(res.data)
    } catch {
      setNotifications([])
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [userData])

  if (!userData) return null

  const unread = notifications.filter((n) => !n.read).length

  const handleRead = async (id, link) => {
    await axios.put(`${serverUrl}/api/user/notifications/${id}/read`, {}, { withCredentials: true })
    fetchNotifications()
    setOpen(false)
    if (link) navigate(link)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-brand-light transition-colors"
        aria-label="Notifications"
      >
        <IoNotificationsOutline className="w-6 h-6" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-brand-pink text-white text-[10px] rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-card border border-brand-border z-50 max-h-96 overflow-y-auto animate-slide-up">
          <div className="p-3 border-b border-brand-border flex justify-between items-center">
            <span className="font-semibold text-sm">Notifications</span>
            {unread > 0 && (
              <button
                type="button"
                className="text-xs text-brand-pink"
                onClick={async () => {
                  await axios.put(`${serverUrl}/api/user/notifications/read-all`, {}, { withCredentials: true })
                  fetchNotifications()
                }}
              >
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-brand-gray text-center">No notifications</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n._id}
                type="button"
                className={`w-full text-left p-3 border-b border-brand-border hover:bg-brand-light transition-colors ${!n.read ? 'bg-brand-pink/5' : ''}`}
                onClick={() => handleRead(n._id, n.link)}
              >
                <p className="text-sm font-medium text-brand-dark">{n.title}</p>
                <p className="text-xs text-brand-gray mt-0.5">{n.message}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell

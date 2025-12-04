import { useState } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { requestNotificationPermission } from '../../utils/notifications'

export const NotificationButton = () => {
  const [permission, setPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission
    }
    return 'denied' 
  })

  const handleRequest = async () => {
    const granted = await requestNotificationPermission()
    setPermission(granted ? 'granted' : 'denied')
  }

  if (typeof window !== 'undefined' && !('Notification' in window)) {
    return null 
  }

  if (permission === 'granted') {
    return (
      <div className="flex items-center gap-2 text-green-400 text-xs font-medium bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
        <Bell size={14} />
        <span>Notif On</span>
      </div>
    )
  }

  return (
    <button 
      onClick={handleRequest}
      className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-medium bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-700 transition-colors cursor-pointer"
    >
      <BellOff size={14} />
      <span>Enable Notif</span>
    </button>
  )
}
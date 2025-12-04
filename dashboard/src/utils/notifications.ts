export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.error('This browser does not support desktop notifications.')
    return false
  }
  
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export const sendSignalNotification = (coin: string, direction: string, price: number) => {
  if (Notification.permission === 'granted') {
    const title = `🚨 New Signal: ${coin} ${direction}`
    const options = {
      body: `Entry: ${price}\nCheck dashboard for TP/SL details!`,
      icon: '/btc.png',
      tag: 'crypto-signal',
      renotify: true,
      silent: false
    }
    
    new Notification(title, options)
  }
}
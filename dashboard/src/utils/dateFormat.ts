export const formatIndoDate = (dateString: string) => {
  const date = new Date(dateString)
  
  // Format: "Senin, 4 Des 2025"
  const datePart = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)

  // Format: "14:30"
  const timePart = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date).replace('.', ':')

  return `${datePart} • Pukul ${timePart} WIB`
}
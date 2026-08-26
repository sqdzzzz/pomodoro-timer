export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }
  if (Notification.permission === 'granted') {
    return 'granted'
  }
  return Notification.requestPermission()
}

export function sendNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  try {
    new Notification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      silent: false,
    })
  } catch {
    // Ignore notification errors
  }
}

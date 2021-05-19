const publicKey = 'BF9Z1MxVOTwhev-xOfGRQdDvXpU3k9VL5phJDyaedZEMN6nKot6ZXExtgl04uAXf--CKXOPOxHsSIKblbLyWF8M'

function urlBase64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

class ServiceWorkerMessenger {
  messageReceived = null

  constructor () {
    navigator.serviceWorker.onmessage = e => {
      console.log('ServiceWorkerMesssenger: msg received', e.data)
      if (this.messageReceived) {
        this.messageReceived(JSON.parse(e.data))
      }
    }
  }

  sendCommand (payload) {
    navigator.serviceWorker.controller.postMessage(JSON.stringify(payload))
  }
}

export default async function registerServiceWorker () {
  if ('serviceWorker' in navigator) {
    console.log('Registring serviceWorker...')
    const register = await navigator.serviceWorker.register('./service-worker.js')
    await register.ready
    const serviceWorkerMessenger = new ServiceWorkerMessenger()
    console.log('serviceWorker registered')

    console.log('Registring push...')
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    })
    console.log('subscribing...')
    serviceWorkerMessenger.sendCommand({
      command: 'subscribe',
      payload: subscription
    })
    console.log('Push registered')

    return { serviceWorkerMessenger }
  } else {
    return { serviceWorkerMessenger: null }
  }
}

console.log('Service worker: loaded')

const cacheName = 'v1'
let client = null

async function connectWs () {
  if (client === null) {
    client = new WebSocket('ws://localhost:8083', 'echo-protocol')

    client.onerror = () => {
      console.log('WebSocket: Connction Error')
    }

    client.onopen = () => {
      console.log('WebSocket: Connected')
    }

    client.onclose = () => {
      console.log('WebSocket: echo-protocol Client Closed')
      client = null
    }

    client.onmessage = e => {
      if (typeof e.data === 'string') {
        onMessageReceived(e.data)
      }
    }
  }
}

async function onMessageReceived (msg) {
  /* eslint-disable-next-line */
  const list = await clients.matchAll()
  list.forEach(client => {
    console.log('Service worker: sending client message -->', msg)
    client.postMessage(msg)
  })
}

self.addEventListener('install', e => {
  console.log('Service worker: install')
})

self.addEventListener('activate', e => {
  console.log('Service worker: activate')
  connectWs()
  // Cleaning old caches
  e.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cache => {
        if (cache !== cacheName) {
          console.log(`Service worker: cleaning "${cacheName}"`)
          return caches.delete(cache)
        }
      })
    ))
  )
})

self.addEventListener('fetch', async e => {
  console.log(`Service Worker: Fetching ${e.request.url}`)
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone()

        caches.open(cacheName).then(cache => {
          cache.put(e.request, resClone)
        })

        return res
      })
      .catch(e => caches.match(e.request).then(res => res))
  )
})

self.addEventListener('push', e => {
  console.log('Service worker: Push received')
  const data = e.data.json()
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'https://i.pinimg.com/originals/5a/1d/4f/5a1d4f99c57c2ea17543df5eca8ead61.jpg'
  })
})

self.addEventListener('message', e => {
  console.log('Service worker: message', e.data)
  if (client && client.readyState === client.OPEN) {
    client.send(e.data)
  }
})

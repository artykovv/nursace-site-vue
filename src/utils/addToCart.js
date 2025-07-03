import debounce from './debounce'
import { ensureSessionId } from './session_init'
import { useAuth } from './auth_utils'

// import { SITE_URL } from './config' // удалено, используем глобальный AppConfig

const SITE_URL = window.AppConfig?.siteUrl || ''

const { getAuthParam } = useAuth()

// showToast: простая реализация, если не определена
function showToast(message, type = 'success') {
  // type: 'success' | 'error'
  let container = document.getElementById('toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    container.style.position = 'fixed'
    container.style.top = '24px'
    container.style.right = '24px'
    container.style.left = ''
    container.style.zIndex = '9999'
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.style.gap = '12px'
    container.style.pointerEvents = 'none'
    document.body.appendChild(container)
  }
  // Мобильная адаптация
  function applyMobileToastStyles() {
    if (window.innerWidth <= 600) {
      container.style.left = '0'
      container.style.right = '0'
      container.style.top = '0'
      container.style.width = '100%'
      container.style.alignItems = 'center'
    } else {
      container.style.left = ''
      container.style.right = '24px'
      container.style.top = '24px'
      container.style.width = ''
      container.style.alignItems = ''
    }
  }
  applyMobileToastStyles()
  window.addEventListener('resize', applyMobileToastStyles)

  const toast = document.createElement('div')
  toast.className = 'custom-toast'
  toast.style.display = 'flex'
  toast.style.alignItems = 'center'
  toast.style.minWidth = '220px'
  toast.style.maxWidth = '350px'
  toast.style.background = type === 'success'
    ? 'linear-gradient(90deg,#cdb5a7 0,#b89b7a 100%)'
    : 'linear-gradient(90deg,#e53935 0,#b71c1c 100%)'
  toast.style.color = '#fff'
  toast.style.padding = '14px 20px'
  toast.style.borderRadius = '10px'
  toast.style.fontSize = '1.05rem'
  toast.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)'
  toast.style.opacity = '0'
  toast.style.transform = 'translateY(-20px)'
  toast.style.transition = 'opacity 0.3s, transform 0.3s'
  toast.style.pointerEvents = 'auto'
  toast.style.userSelect = 'none'
  toast.style.cursor = 'pointer'
  toast.style.width = window.innerWidth <= 600 ? '96%' : ''
  toast.style.margin = window.innerWidth <= 600 ? '12px auto 0 auto' : ''
  toast.innerHTML = `
    <span style="margin-right:12px;display:flex;align-items:center;">
      ${type === 'success' ?
        '<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff" fill-opacity=".15"/><path d="M7 13.5l3 3 7-7" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
        '<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff" fill-opacity=".15"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>'}
    </span>
    <span style="flex:1;">${message}</span>
  `
  container.appendChild(toast)
  // Анимация появления
  setTimeout(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateY(0)'
  }, 10)
  // Анимация исчезновения и удаление
  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(-20px)'
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast)
    }, 350)
  }, 2200)
  // Клик — сразу убрать
  toast.onclick = () => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(-20px)'
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast)
    }, 350)
  }
}

export const addToCart = debounce(async function(goodId, quantity = 1) {
  const sessionId = await ensureSessionId()
  const param = await getAuthParam()
  const payload = {
    product_id: goodId,
    quantity: quantity,
  }
  if (param.startsWith('user_id=')) {
    payload.user_id = param.split('=')[1]
  } else if (param.startsWith('session_id=')) {
    payload.session_id = param.split('=')[1]
  }
  try {
    const response = await fetch(`${SITE_URL}/cart/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      let msg = 'Failed to add to cart'
      try {
        const err = await response.json()
        msg = err.detail || msg
      } catch {}
      throw new Error(msg)
    }
    if (window.updateCartCount) {
      await window.updateCartCount()
    }
    if (window.cartRefresh) {
      window.cartRefresh()
    }
    showToast('Товар добавлен в корзину!')
  } catch (error) {
    console.error('Error adding to cart:', error)
    showToast('Ошибка при добавлении в корзину: ' + (error.message || 'Неизвестная ошибка'), 'error')
  }
}, 300) 
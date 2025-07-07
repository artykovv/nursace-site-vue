<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card p-4">
          <h2 class="mb-4 text-center">Регистрация</h2>
          <form @submit.prevent="register">
            <div class="mb-3">
              <label class="form-label">Имя</label>
              <input v-model="form.name" type="text" class="form-control form-control-lg" required autofocus>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="form.login" type="email" class="form-control form-control-lg" required>
            </div>
            <div class="mb-3 d-flex align-items-center">
              <button class="btn btn-outline-secondary btn-lg me-2" type="button" @click="sendCode" :disabled="codeSentLoading || codeCooldown > 0">Получить код</button>
              <span v-if="codeCooldown > 0" class="text-muted small">Подождите {{ codeCooldown }} сек</span>
            </div>
            <div class="mb-3">
              <label class="form-label">Код подтверждения</label>
              <input v-model="form.code" type="text" maxlength="4" class="form-control form-control-lg" :disabled="!codeSent" placeholder="Введите код из письма">
              <button class="btn btn-outline-success btn-lg mt-2 w-100" type="button" @click="checkCode" :disabled="!form.code || codeCheckLoading || codeVerified">Подтвердить код</button>
              <div v-if="codeAlert.message" :class="['alert', codeAlert.type, 'mt-2', 'text-center']">{{ codeAlert.message }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Пароль</label>
              <input v-model="form.password" type="password" class="form-control form-control-lg" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Повторите пароль</label>
              <input v-model="form.password2" type="password" class="form-control form-control-lg" required>
            </div>
            <button class="btn btn-primary btn-lg w-100" type="submit" :disabled="loading || !codeVerified">Зарегистрироваться</button>
            <div v-if="alert.message" :class="['alert', alert.type, 'mt-3', 'text-center']">{{ alert.message }}</div>
          </form>
          <div class="text-center mt-3">
            <router-link to="/login">Уже есть аккаунт? Войти</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const form = ref({ name: '', login: '', password: '', password2: '', code: '' })
const loading = ref(false)
const alert = ref({ message: '', type: '' })
const codeAlert = ref({ message: '', type: '' })
const codeSent = ref(false)
const codeSentLoading = ref(false)
const codeCheckLoading = ref(false)
const codeVerified = ref(false)
const codeCooldown = ref(0)
let cooldownTimer = null

onMounted(() => { document.title = 'Регистрация | Nursace' })

function startCooldown(seconds) {
  codeCooldown.value = seconds
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    if (codeCooldown.value > 0) codeCooldown.value--
    else clearInterval(cooldownTimer)
  }, 1000)
}

async function sendCode() {
  codeAlert.value = { message: '', type: '' }
  codeSentLoading.value = true
  try {
    const res = await fetch(`${window.AppConfig.siteUrl}/verify/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.value.login })
    })
    const data = await res.json()
    if (res.ok) {
      codeAlert.value = { message: 'Код отправлен на почту. Письмо с кодом может попасть в спам. Пожалуйста, проверьте папку Спам.', type: 'alert-success' }
      codeSent.value = true
      startCooldown(60)
    } else {
      if (data.detail && data.detail.includes('Пожалуйста, подождите')) {
        const seconds = parseInt(data.detail.match(/\d+/)?.[0] || '60')
        startCooldown(seconds)
      }
      codeAlert.value = { message: data.detail || 'Ошибка отправки кода', type: 'alert-danger' }
    }
  } catch (e) {
    codeAlert.value = { message: 'Ошибка соединения с сервером.', type: 'alert-danger' }
  } finally {
    codeSentLoading.value = false
  }
}

async function checkCode() {
  codeAlert.value = { message: '', type: '' }
  codeCheckLoading.value = true
  try {
    const res = await fetch(`${window.AppConfig.siteUrl}/verify/check-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.value.login, code: form.value.code })
    })
    const data = await res.json()
    if (res.ok && data.message && (data.message.includes('Почта подтверждена') || data.message.includes('Уже подтверждено'))) {
      codeAlert.value = { message: data.message, type: 'alert-success' }
      codeVerified.value = true
    } else {
      let errorMsg = 'Неизвестная ошибка'
      if (data.detail) {
        if (typeof data.detail === 'string') {
          errorMsg = data.detail
        } else if (Array.isArray(data.detail)) {
          errorMsg = data.detail.map(e => e.msg || JSON.stringify(e)).join('; ')
        } else if (typeof data.detail === 'object') {
          errorMsg = JSON.stringify(data.detail)
        }
      }
      codeAlert.value = { message: 'Ошибка подтверждения кода: ' + errorMsg, type: 'alert-danger' }
      codeVerified.value = false
    }
  } catch (e) {
    codeAlert.value = { message: 'Ошибка соединения с сервером.', type: 'alert-danger' }
    codeVerified.value = false
  } finally {
    codeCheckLoading.value = false
  }
}

async function register() {
  loading.value = true
  alert.value = { message: '', type: '' }
  if (!codeVerified.value) {
    alert.value = { message: 'Сначала подтвердите почту', type: 'alert-danger' }
    loading.value = false
    return
  }
  if (form.value.password !== form.value.password2) {
    alert.value = { message: 'Пароли не совпадают', type: 'alert-danger' }
    loading.value = false
    return
  }
  if (form.value.password.length < 6) {
    alert.value = { message: 'Пароль должен содержать минимум 6 символов', type: 'alert-danger' }
    loading.value = false
    return
  }
  try {
    const res = await fetch(`${window.AppConfig.siteUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: form.value.login, password: form.value.password, name: form.value.name, session_id: localStorage.getItem('session_id') })
    })
    const data = await res.json()
    if (res.ok) {
      alert.value = { message: 'Регистрация успешна! Перенаправляем на страницу входа...', type: 'alert-success' }
      // Получаем session_id
      try {
        const userMeRes = await fetch(`${window.AppConfig.siteUrl}/user/me`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        })
        if (userMeRes.ok) {
          const userData = await userMeRes.json()
          if (userData.session_id) {
            localStorage.removeItem('session_id')
            localStorage.setItem('session_id', userData.session_id)
          }
        }
      } catch (e) {}
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      let errorMsg = 'Неизвестная ошибка'
      if (data.detail) {
        if (typeof data.detail === 'string') {
          errorMsg = data.detail
        } else if (Array.isArray(data.detail)) {
          errorMsg = data.detail.map(e => e.msg || JSON.stringify(e)).join('; ')
        } else if (typeof data.detail === 'object') {
          errorMsg = JSON.stringify(data.detail)
        }
      }
      alert.value = { message: 'Ошибка регистрации: ' + errorMsg, type: 'alert-danger' }
    }
  } catch (e) {
    alert.value = { message: 'Ошибка соединения с сервером.', type: 'alert-danger' }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.btn-primary {
  background: #cdb5a7;
  border: none;
}
.btn-primary:hover, .btn-primary:focus {
  background: #b89b7a;
}
</style> 
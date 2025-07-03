<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card p-4">
          <h2 class="mb-4 text-center">Вход</h2>
          <form @submit.prevent="login">
            <div class="mb-3">
              <label class="form-label">Email или телефон</label>
              <input v-model="form.login" type="text" class="form-control" required autofocus>
            </div>
            <div class="mb-3">
              <label class="form-label">Пароль</label>
              <input v-model="form.password" type="password" class="form-control" required>
            </div>
            <button class="btn btn-primary w-100" type="submit" :disabled="loading">Войти</button>
            <div v-if="alert.message" :class="['alert', alert.type, 'mt-3', 'text-center']">{{ alert.message }}</div>
          </form>
          <div class="text-center mt-3">
            <router-link to="/register">Нет аккаунта? Зарегистрироваться</router-link>
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
const form = ref({ login: '', password: '' })
const loading = ref(false)
const alert = ref({ message: '', type: '' })

onMounted(() => { document.title = 'Вход | Nursace' })

function setCookie(name, value, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; expires=' + expires
}

async function login() {
  loading.value = true
  alert.value = { message: '', type: '' }
  try {
    const res = await fetch(`${window.AppConfig.siteUrl}/auth/jwt/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      body: new URLSearchParams({ grant_type: 'password', username: form.value.login, password: form.value.password })
    })
    const data = await res.json()
    if (res.ok && data.access_token) {
      alert.value = { message: 'Успешный вход! Перенаправляем...', type: 'alert-success' }
      setCookie('Bearer', data.access_token)
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
      } catch (e) {
        // Не критично
      }
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    } else {
      alert.value = { message: 'Ошибка авторизации: ' + (data.detail || 'Неизвестная ошибка'), type: 'alert-danger' }
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
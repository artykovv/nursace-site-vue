<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card p-4">
          <h2 class="mb-4 text-center">Регистрация</h2>
          <form @submit.prevent="register">
            <div class="mb-3">
              <label class="form-label">Имя</label>
              <input v-model="form.name" type="text" class="form-control" required autofocus>
            </div>
            <div class="mb-3">
              <label class="form-label">Email или телефон</label>
              <input v-model="form.login" type="text" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Пароль</label>
              <input v-model="form.password" type="password" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Повторите пароль</label>
              <input v-model="form.password2" type="password" class="form-control" required>
            </div>
            <button class="btn btn-primary w-100" type="submit" :disabled="loading">Зарегистрироваться</button>
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
const form = ref({ name: '', login: '', password: '', password2: '' })
const loading = ref(false)
const alert = ref({ message: '', type: '' })

onMounted(() => { document.title = 'Регистрация | Nursace' })

async function register() {
  loading.value = true
  alert.value = { message: '', type: '' }
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
      alert.value = { message: 'Ошибка регистрации: ' + (data.detail || 'Неизвестная ошибка'), type: 'alert-danger' }
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
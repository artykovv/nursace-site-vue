<template>
  <div>
    <div class="stepper-wrapper mb-4">
      <div class="stepper-flex">
        <div v-for="n in maxStep" :key="n" class="stepper-circle-flex" :class="{active: step >= n}">{{ n }}</div>
      </div>
      <div class="stepper-bar-flex">
        <div class="stepper-bar-inner" :style="barFlexStyle"></div>
      </div>
    </div>
    <form @submit.prevent="handleSubmit">
      <div v-if="step === 1">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" required class="form-control form-control-lg" :disabled="loading" autocomplete="email" />
        </div>
        <div class="mb-3">
          <label class="form-label">Пароль</label>
          <input v-model="form.password" type="password" required class="form-control form-control-lg" :disabled="loading" autocomplete="new-password" />
        </div>
        <div class="mb-3">
          <label class="form-label">Повторите пароль</label>
          <input v-model="form.password2" type="password" required class="form-control form-control-lg" :disabled="loading" autocomplete="new-password" />
        </div>
      </div>
      <div v-else-if="step === 2">
        <div class="mb-3">
          <label class="form-label">Код из почты</label>
          <input v-model="form.code" type="text" required class="form-control form-control-lg" :disabled="loading" autocomplete="one-time-code" />
        </div>
        <div class="mb-2 text-center text-muted" style="font-size:1.1em;">Введите код, который пришёл на <b>{{ form.email }}</b></div>
      </div>
      <div class="stepper-actions mt-4">
        <button v-if="step > 1" type="button" class="btn btn-outline-secondary btn-lg w-100 mb-2 py-3 fs-5" @click="prevStep" :disabled="loading">Назад</button>
        <button type="submit" class="btn btn-primary btn-lg w-100 py-3 fs-5" :disabled="loading">
          <span v-if="loading">Загрузка...</span>
          <span v-else>{{ step === maxStep ? 'Завершить регистрацию' : 'Далее' }}</span>
        </button>
      </div>
      <div v-if="userExistsError" class="alert alert-warning mt-3 text-center">Пользователь с таким email уже зарегистрирован. <router-link to="/login" class="link-primary">Войти</router-link></div>
      <div v-if="error" class="alert alert-danger mt-3 text-center">{{ error }}</div>
      <div v-if="success" class="alert alert-success mt-3 text-center">{{ success }}</div>
    </form>
    <div class="text-center mt-3">
      <router-link to="/login" class="link-primary fs-6">Уже есть аккаунт? <b>Войти</b></router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const step = ref(1)
const maxStep = 2
const form = ref({
  email: '',
  password: '',
  password2: '',
  code: ''
})
const error = ref('')
const success = ref('')
const loading = ref(false)
const codeVerified = ref(false)
const userExistsError = ref(false)

// Stepper bar flex logic
const barFlexStyle = computed(() => {
  const percent = (step.value - 1) / (maxStep - 1)
  return {
    width: percent * 100 + '%',
    transition: 'width 0.3s',
  }
})

function validateStep() {
  error.value = ''
  userExistsError.value = false
  if (step.value === 1) {
    if (!form.value.email || !form.value.password || !form.value.password2) {
      error.value = 'Заполните email и оба поля пароля.'
      return false
    }
    if (form.value.password.length < 6) {
      error.value = 'Пароль должен содержать минимум 6 символов.'
      return false
    }
    if (form.value.password !== form.value.password2) {
      error.value = 'Пароли не совпадают.'
      return false
    }
  } else if (step.value === 2) {
    if (!form.value.code) {
      error.value = 'Введите код подтверждения.'
      return false
    }
  }
  return true
}

async function handleSubmit() {
  error.value = ''
  success.value = ''
  userExistsError.value = false
  if (!validateStep()) return
  if (step.value === 1) {
    // Отправляем код на почту
    loading.value = true
    try {
      const res = await fetch(`${window.AppConfig.siteUrl}/verify/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.value.email })
      })
      const data = await res.json()
      if (res.ok) {
        step.value = 2
        success.value = 'Код отправлен на почту. Письмо с кодом может попасть в спам.'
      } else {
        if (data.code === 'REGISTER_USER_ALREADY_EXISTS' || (data.detail && data.detail.includes('уже зарегистрирован'))) {
          userExistsError.value = true
        } else {
          error.value = data.detail || 'Ошибка отправки кода.'
        }
      }
    } catch (e) {
      error.value = 'Ошибка соединения с сервером.'
    } finally {
      loading.value = false
    }
  } else if (step.value === 2) {
    // Проверяем код и регистрируем пользователя
    loading.value = true
    try {
      // Сначала проверяем код
      const resCheck = await fetch(`${window.AppConfig.siteUrl}/verify/check-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.value.email, code: form.value.code })
      })
      const dataCheck = await resCheck.json()
      if (resCheck.ok && dataCheck.message && (dataCheck.message.includes('Почта подтверждена') || dataCheck.message.includes('Уже подтверждено'))) {
        codeVerified.value = true
        // Теперь регистрируем пользователя
        const resReg = await fetch(`${window.AppConfig.siteUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            email: form.value.email,
            password: form.value.password,
            session_id: localStorage.getItem('session_id')
          })
        })
        const dataReg = await resReg.json()
        if (resReg.ok) {
          success.value = 'Регистрация успешна! Перенаправляем на страницу входа...'
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000)
        } else {
          let errorMsg = 'Неизвестная ошибка'
          if (dataReg.code === 'REGISTER_USER_ALREADY_EXISTS' || (dataReg.detail && dataReg.detail.includes('уже зарегистрирован'))) {
            userExistsError.value = true
          } else if (dataReg.detail) {
            if (typeof dataReg.detail === 'string') {
              errorMsg = dataReg.detail
            } else if (Array.isArray(dataReg.detail)) {
              errorMsg = dataReg.detail.map(e => e.msg || JSON.stringify(e)).join('; ')
            } else if (typeof dataReg.detail === 'object') {
              errorMsg = JSON.stringify(dataReg.detail)
            }
          }
          error.value = 'Ошибка регистрации: ' + errorMsg
        }
      } else {
        let errorMsg = 'Неизвестная ошибка'
        if (dataCheck.detail) {
          if (typeof dataCheck.detail === 'string') {
            errorMsg = dataCheck.detail
          } else if (Array.isArray(dataCheck.detail)) {
            errorMsg = dataCheck.detail.map(e => e.msg || JSON.stringify(e)).join('; ')
          } else if (typeof dataCheck.detail === 'object') {
            errorMsg = JSON.stringify(dataCheck.detail)
          }
        }
        error.value = 'Ошибка подтверждения кода: ' + errorMsg
      }
    } catch (e) {
      error.value = 'Ошибка соединения с сервером.'
    } finally {
      loading.value = false
    }
  }
}

function prevStep() {
  if (step.value > 1) step.value--
}
</script>

<style scoped>
.stepper-wrapper {
  width: 100%;
  margin-bottom: 24px;
}
.stepper-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  margin-bottom: 8px;
}
.stepper-circle-flex {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #eee;
  color: #b89b7a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  border: 2px solid #b89b7a;
  transition: background 0.2s, color 0.2s;
}
.stepper-circle-flex.active {
  background: #b89b7a;
  color: #fff;
}
.stepper-bar-flex {
  position: relative;
  width: 100%;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  overflow: hidden;
}
.stepper-bar-inner {
  height: 100%;
  background: #b89b7a;
  border-radius: 2px;
  transition: width 0.3s;
}
@media (max-width: 600px) {
  .stepper-circle-flex {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
  .btn-lg {
    font-size: 1.15rem;
    padding-top: 1.1rem;
    padding-bottom: 1.1rem;
  }
}
.stepper-actions {
  margin-top: 20px;
}
</style> 
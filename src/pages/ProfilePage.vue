<template>
  <div class="container py-5 profile-container">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="profile-card p-4">
          <h2 class="mb-4 text-center">Профиль</h2>
          <div v-if="loading" class="text-center my-4">
            <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
          </div>
          <div v-else-if="user">
            <div class="mb-3 text-center">
              <i class="bi bi-person-circle profile-avatar"></i>
            </div>
            <h4 class="mb-2 text-center">Здравствуйте, {{ user.name || user.email || 'Пользователь' }}!</h4>
            <div class="mb-2 text-center"><b>Email:</b> {{ user.email || '—' }}</div>
            <div class="mt-4 d-flex flex-column gap-3 align-items-center">
              <router-link to="/profile/orders" class="btn btn-primary profile-btn w-100 d-flex flex-column align-items-center justify-content-center">
                <i class="bi bi-bag-check" style="font-size: 2rem;"></i>
                <span class="mt-2">Заказы</span>
              </router-link>
              <button @click="handleLogout" class="btn btn-outline-danger profile-btn w-100" style="font-size: 1.2rem;">
                <i class="bi bi-box-arrow-right"></i>
                <span class="ms-2">Выйти</span>
              </button>
            </div>
          </div>
          <div v-else class="alert alert-warning text-center">
            Вы не авторизованы.<br>
            <router-link to="/login">Войти</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../utils/auth_utils'

const { user, isAuthenticated, checkAuth, logout } = useAuth()
const loading = ref(true)
const router = useRouter()

async function handleLogout() {
  logout()
  router.replace('/login')
}

onMounted(async () => {
  loading.value = true
  await checkAuth()
  loading.value = false
  if (!isAuthenticated.value) {
    router.replace('/login')
  }
  document.title = 'Профиль | Nursace'
})
</script>

<style scoped>

.profile-card {
  background: transparent;
  box-shadow: none;
  border: none;
  padding: 2.5rem 2rem 2rem 2rem;
}
.profile-avatar {
  font-size: 3.5rem;
  color: #b89b7a;
}
.profile-btn {
  min-width: 180px;
  min-height: 56px;
  font-size: 1.15rem;
  border-radius: 14px;
  box-shadow: none;
  transition: background 0.2s, color 0.2s;
  font-weight: 500;
}
@media (max-width: 576px) {
  .profile-card {
    padding: 1.2rem 0.5rem;
  }
  .profile-btn {
    min-width: 100%;
    width: 100%;
    font-size: 1.05rem;
    margin-bottom: 0.5rem;
    border-radius: 10px;
  }
  .profile-avatar {
    font-size: 2.5rem;
  }
}
</style> 
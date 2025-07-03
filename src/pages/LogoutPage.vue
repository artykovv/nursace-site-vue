<template>
  <div class="container py-5 text-center">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card p-4">
          <h2 class="mb-4">Выход</h2>
          <div class="alert alert-info">Вы вышли из аккаунта</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

function deleteCookie(name) {
  document.cookie = name + '=; Max-Age=0; path=/;'
}

onMounted(() => {
  deleteCookie('Bearer')
  localStorage.removeItem('session_id')
  setTimeout(() => {
    router.push('/')
  }, 1500)
  document.title = 'Выход | Nursace'
})
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
</style> 
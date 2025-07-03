<template>
  <div class="container py-5">
    <h2 class="mb-4">Оплата успешно завершена</h2>
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div class="alert alert-success text-center p-4">
          <h4 class="alert-heading mb-3">Спасибо за ваш заказ!</h4>
          <p>Ваш платеж успешно обработан. Вы получите подтверждение заказа по электронной почте в ближайшее время.</p>
          <hr>
          <p class="mb-0">Если у вас есть вопросы, свяжитесь с нашей службой поддержки.</p>
        </div>
        <router-link to="/" class="w-100 btn btn-primary btn-lg mt-4">Вернуться на главную</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => { document.title = 'Оплата успешна | Nursace' })
</script>

<style scoped>
.alert-success {
  background: linear-gradient(90deg,#cdebb7 0,#a7d7b5 100%);
  color: #2e7d32;
  font-weight: bold;
}
.btn-primary {
  background: #cdb5a7;
  border: none;
}
.btn-primary:hover, .btn-primary:focus {
  background: #b89b7a;
}
</style> 
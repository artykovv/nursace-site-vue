<template>
  <div class="container py-5">
    <h2 class="mb-4">Ошибка оплаты</h2>
    <div class="row g-5">
      <div class="col-md-5 col-lg-4 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-primary">Ваша корзина</span>
          <span class="badge bg-badge rounded-pill">{{ cart.length }}</span>
        </h4>
        <ul class="list-group mb-3">
          <li v-if="cart.length === 0" class="list-group-item">Корзина пуста</li>
          <li v-for="item in cart" :key="item.product_id" class="list-group-item d-flex justify-content-between lh-sm">
            <div>
              <h6 class="my-0">{{ item.good_name }}</h6>
              <small class="text-body-secondary">Количество: {{ item.quantity }}</small>
            </div>
            <span class="text-body-secondary">{{ item.price * item.quantity }} сом</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Итого</span>
            <strong>{{ total }} сом</strong>
          </li>
        </ul>
      </div>
      <div class="col-md-7 col-lg-8">
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Оплата не удалась</h4>
          <p>К сожалению, ваш платеж не был обработан. Пожалуйста, проверьте данные платежа или попробуйте другой способ оплаты.</p>
          <hr>
          <p class="mb-0">Если проблема сохраняется, свяжитесь с нашей службой поддержки.</p>
        </div>
        <router-link to="/checkout" class="w-100 btn btn-primary btn-lg mt-4">Вернуться к оформлению заказа</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const cart = ref([])
const total = ref(0)

async function fetchCart() {
  try {
    const param = window.getAuthParam ? await window.getAuthParam() : null
    if (!param) return
    const url = `${window.AppConfig.siteUrl}/cart/?${param}`
    const res = await fetch(url)
    if (!res.ok) return
    const data = await res.json()
    cart.value = (Array.isArray(data) ? data : (data.items || [])).map(item => ({
      product_id: item.product_id,
      good_name: item.product?.good_name || '',
      price: item.product?.retail_price_with_discount ?? item.product?.retail_price ?? 0,
      quantity: item.quantity
    }))
    total.value = cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  } catch (e) {
    cart.value = []
    total.value = 0
  }
}

onMounted(() => {
  fetchCart()
  window.cartRefresh = fetchCart
  document.title = 'Ошибка оплаты | Nursace'
})
onUnmounted(() => {
  if (window.cartRefresh === fetchCart) window.cartRefresh = null
})
</script>

<style scoped>
.alert-danger {
  background: linear-gradient(90deg,#ffd6d6 0,#ffbaba 100%);
  color: #b71c1c;
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
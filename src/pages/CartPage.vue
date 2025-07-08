<template>
  <div v-if="loading" class="container text-center py-5">
    <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
  </div>
  <div v-else>
    <div class="container">
      <h2 class="mb-5">Корзина</h2>
      <div class="row">
        <div class="col-lg-8">
          <div class="card mb-4">
            <div class="card-body" id="cart-items">
              <div v-if="cart.length === 0" class="text-muted">Ваша корзина пуста</div>
              <div v-else>
                <transition-group name="cart-fade" tag="div">
                  <div v-for="item in cart" :key="item.product_id" class="row cart-item align-items-center mb-3 pb-3 border-bottom">
                    <div class="col-3 col-md-2">
                      <img :src="item.image_url || placeholder" :alt="item.good_name" class="img-fluid rounded" style="max-width:70px;max-height:70px;object-fit:cover;">
                    </div>
                    <div class="col-9 col-md-4">
                      <h5 class="mb-1">{{ item.good_name }}</h5>
                      <div class="text-muted small">Цена: {{ item.price }} сом</div>
                    </div>
                    <div class="col-7 col-md-3 mt-2 mt-md-0">
                      <div class="input-group input-group-sm w-auto">
                        <button class="btn btn-outline-secondary" @click="changeQuantity(item, item.quantity-1)" :disabled="item.quantity<=1 || changingId === item.product_id">-</button>
                        <input type="text" class="form-control text-center" :value="item.quantity" readonly style="max-width:60px;">
                        <button class="btn btn-outline-secondary" @click="changeQuantity(item, item.quantity+1)" :disabled="changingId === item.product_id">+</button>
                      </div>
                    </div>
                    <div class="col-3 col-md-2 text-end fw-bold">
                      {{ item.price * item.quantity }} сом
                    </div>
                    <div class="col-2 col-md-1 text-end">
                      <button class="btn btn-sm btn-outline-danger" @click="removeItem(item)" :disabled="removingId === item.product_id"><i class="bi bi-trash"></i></button>
                    </div>
                  </div>
                </transition-group>
              </div>
            </div>
          </div>
          <div class="text-start mb-4">
            <router-link to="/" class="btn btn-outline-primary">
              <i class="bi bi-arrow-left me-2"></i>Продолжить покупки
            </router-link>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card cart-summary">
            <div class="card-body">
              <h5 class="card-title mb-4">Итоги</h5>
              <div class="d-flex justify-content-between mb-3">
                <span>Промежуточный итог</span>
                <span>{{ total }} сом</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between mb-4">
                <strong>Итог</strong>
                <strong>{{ total }} сом</strong>
              </div>
              <router-link to="/checkout" class="btn btn-primary w-100">Оформить заказ</router-link>
              <div v-if="status === 'success'" class="alert alert-success text-center mt-4">Оплата прошла успешно!</div>
              <div v-if="status === 'fail'" class="alert alert-danger text-center mt-4">Оплата не прошла. Попробуйте ещё раз.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const cart = ref([])
const total = ref(0)
const status = ref('')
const loading = ref(false)
const removingId = ref(null)
const changingId = ref(null)
const placeholder = 'https://placehold.co/70x70'

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
      image_url: item.product?.images?.[0]?.image_url || '',
      price: item.product?.retail_price_with_discount ?? item.product?.retail_price ?? 0,
      quantity: item.quantity
    }))
    total.value = cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  } catch (e) {
    cart.value = []
    total.value = 0
  }
}

async function changeQuantity(item, newQuantity) {
  if (newQuantity < 1) return
  changingId.value = item.product_id
  try {
    const param = window.getAuthParam ? await window.getAuthParam() : null
    if (!param) return
    const url = `${window.AppConfig.siteUrl}/cart/update-count?product_id=${item.product_id}&new_quantity=${newQuantity}&${param}`
    const res = await fetch(url, { method: 'PUT' })
    if (!res.ok) throw new Error('Ошибка изменения количества')
    // Обновляем количество локально
    const idx = cart.value.findIndex(i => i.product_id === item.product_id)
    if (idx !== -1) {
      cart.value[idx].quantity = newQuantity
      total.value = cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
    }
  } catch (e) {
    // Можно добавить showToast('Ошибка изменения количества', 'error')
  } finally {
    changingId.value = null
  }
}

async function removeItem(item) {
  removingId.value = item.product_id
  try {
    const param = window.getAuthParam ? await window.getAuthParam() : null
    if (!param) return
    const url = `${window.AppConfig.siteUrl}/cart/remove?product_id=${item.product_id}&${param}`
    const res = await fetch(url, { method: 'DELETE' })
    if (!res.ok) throw new Error('Ошибка удаления товара')
    // Удаляем товар локально с анимацией
    const idx = cart.value.findIndex(i => i.product_id === item.product_id)
    if (idx !== -1) {
      cart.value.splice(idx, 1)
      total.value = cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
    }
  } catch (e) {
    // Можно добавить showToast('Ошибка удаления товара', 'error')
  } finally {
    removingId.value = null
  }
}

function pay() {
  loading.value = true
  status.value = ''
  setTimeout(() => {
    loading.value = false
    if (Math.random() > 0.5) {
      status.value = 'success'
      cart.value = []
      total.value = 0
    } else {
      status.value = 'fail'
    }
  }, 1200)
}

onMounted(() => {
  fetchCart()
  window.cartRefresh = fetchCart
  document.title = 'Корзина | Nursace'
})
onUnmounted(() => {
  if (window.cartRefresh === fetchCart) window.cartRefresh = null
})
</script>

<style scoped>
.cart-list {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 0;
}
.cart-item {
  background: #fff;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}
.btn-primary {
  background: #cdb5a7;
  border: none;
}
.btn-primary:hover, .btn-primary:focus {
  background: #b89b7a;
}
.alert-success {
  background: linear-gradient(90deg,#cdebb7 0,#a7d7b5 100%);
  color: #2e7d32;
  font-weight: bold;
}
.alert-danger {
  background: linear-gradient(90deg,#ffd6d6 0,#ffbaba 100%);
  color: #b71c1c;
  font-weight: bold;
}
@media (max-width: 991px) {
  .cart-summary { margin-top: 32px; }
}
.cart-fade-enter-active, .cart-fade-leave-active {
  transition: opacity 0.32s, transform 0.32s;
}
.cart-fade-enter-from, .cart-fade-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style> 
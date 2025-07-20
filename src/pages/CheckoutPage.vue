<template>
  <div class="container py-5">
    <h2 class="mb-5">Оформление заказа</h2>
    <div class="row g-5 mt-3">
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
        <form @submit.prevent="submitOrder" class="needs-validation card p-4" novalidate>
          <div class="row g-3 mt-3">
            <div class="col-sm-6">
              <label class="form-label">Имя</label>
              <input v-model="form.first_name" type="text" class="form-control" :class="{'is-invalid': fieldErrors.first_name}" required>
            </div>
            <div class="col-sm-6">
              <label class="form-label">Фамилия</label>
              <input v-model="form.last_name" type="text" class="form-control" :class="{'is-invalid': fieldErrors.last_name}" required>
            </div>
            <div class="col-12">
              <label class="form-label">Телефон</label>
              <input v-model="form.phone" type="tel" class="form-control" :class="{'is-invalid': fieldErrors.phone}" required placeholder="+996...">
            </div>
            <div class="col-12">
              <label class="form-label">Email <span class="text-body-secondary"></span></label>
              <input v-model="form.email" type="email" class="form-control" :class="{'is-invalid': fieldErrors.email}" >
            </div>
            <div class="col-12">
              <label class="form-label">Адрес</label>
              <input v-model="form.address_line1" type="text" class="form-control" :class="{'is-invalid': fieldErrors.address_line1}" required>
            </div>
            <div class="col-12">
              <label class="form-label">Примечания к заказу <span class="text-body-secondary">(Необязательно)</span></label>
              <textarea v-model="form.order_note" class="form-control" rows="2"></textarea>
            </div>
            <div class="col-md-5">
              <label class="form-label">Город</label>
              <input v-model="form.city" type="text" class="form-control" :class="{'is-invalid': fieldErrors.city}" required>
            </div>
            <div class="col-md-4">
              <label class="form-label">Регион</label>
              <input v-model="form.region" type="text" class="form-control" :class="{'is-invalid': fieldErrors.region}" required>
            </div>
            <div class="col-md-3">
              <label class="form-label">Почтовый индекс</label>
              <input v-model="form.postal_code" type="text" class="form-control" :class="{'is-invalid': fieldErrors.postal_code}" required>
            </div>
          </div>
          <!-- <hr class="my-4">
          <div class="form-check">
            <input v-model="form.is_save" type="checkbox" class="form-check-input" id="is_save">
            <label class="form-check-label" for="is_save">Сохранить эту информацию для следующего раза</label>
          </div> -->
          <hr class="my-4">
          <h4 class="mb-3">Оплата</h4>
          <div class="my-3">
            <div class="form-check">
              <input id="credit" name="paymentMethod" type="radio" class="form-check-input" checked required>
              <label class="form-check-label" for="credit">Freedompay</label>
            </div>
          </div>
          <hr class="my-4">
          <button class="w-100 btn btn-primary btn-lg" type="submit" :disabled="loading">Продолжить оформление</button>
          <div class="mt-3 text-center small text-muted">
            Продолжая покупку, вы принимаете
            <a href="/docs/userAgreement" target="_blank" rel="noopener noreferrer">Правила и условия</a>
            и
            <a href="/docs/privacyPolicy" target="_blank" rel="noopener noreferrer">Политика Конфиденциальности</a>
          </div>
          <div v-if="status === 'success'" class="alert alert-success text-center mt-4">Заказ успешно оформлен!</div>
          <div v-if="status === 'fail'" class="alert alert-danger text-center mt-4">Ошибка оформления заказа. Попробуйте ещё раз.</div>
          <div v-if="formError" class="alert alert-danger text-center mt-4">{{ formError }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const cart = ref([])
const total = ref(0)
const loading = ref(false)
const status = ref('')
const formError = ref('')
const form = ref({
  first_name: '', last_name: '', phone: '', email: '', address_line1: '', city: '', region: '', postal_code: '', order_note: '', is_save: false
})
const fieldErrors = ref({})

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

async function submitOrder() {
  formError.value = ''
  loading.value = true
  status.value = ''
  fieldErrors.value = {}
  // Валидация обязательных полей
  const requiredFields = ['first_name', 'last_name', 'phone', 'email', 'address_line1', 'city', 'region', 'postal_code']
  let hasError = false
  for (const field of requiredFields) {
    if (!form.value[field] || String(form.value[field]).trim() === '') {
      fieldErrors.value[field] = true
      hasError = true
    }
  }
  if (hasError) {
    loading.value = false
    return
  }
  try {
    let session_id = ''
    if (window.getAuthParam) {
      const param = await window.getAuthParam()
      session_id = param.split('=')[1] || ''
    }
    const url = `${window.AppConfig.siteUrl}/orders/checkout`
    const payload = { ...form.value, session_id, items: cart.value }
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Ошибка оформления заказа')
    const data = await res.json()
    if (data.payment_url) {
      window.location.href = data.payment_url
      return
    }
    status.value = 'success'
    cart.value = []
    total.value = 0
  } catch (e) {
    status.value = 'fail'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCart()
  window.cartRefresh = fetchCart
  document.title = 'Оформление заказа | Nursace'
})
onUnmounted(() => {
  if (window.cartRefresh === fetchCart) window.cartRefresh = null
})
</script>

<style scoped>
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
.is-invalid {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.2rem rgba(220,53,69,.25);
}
@media (max-width: 991px) {
  .card { margin-bottom: 24px; }
}
</style> 
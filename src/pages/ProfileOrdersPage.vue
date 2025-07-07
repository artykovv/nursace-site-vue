<template>
  <div class="container py-5">
    <h2 class="mb-4 text-center">Мои заказы</h2>
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
    </div>
    <div v-else-if="orders.length === 0" class="alert alert-info text-center">
      У вас пока нет заказов
    </div>
    <div v-else>
      <div class="orders-container">
        <div v-for="order in orders" :key="order.id" class="order-card mb-4">
          <div class="d-flex flex-wrap justify-content-between align-items-center mb-2 order-header">
            <h4 class="order-id">Заказ #{{ order.id }}</h4>
            <span class="order-status-badge" :class="{
              'badge-processing': order.status_id === 1,
              'badge-success': order.status_id === 2,
              'badge-fail': order.status_id === 3
            }">
              {{ order.status || (order.status_id === 1 ? 'В обработке' : order.status_id === 2 ? 'Завершён' : 'Ошибка') }}
            </span>
          </div>
          <div class="order-info mb-2">
            <span class="order-date"><i class="bi bi-calendar2-week"></i> {{ formatDate(order.created_at) }}</span>
            <span class="order-total"><i class="bi bi-cash"></i> {{ order.total_price }} сом</span>
          </div>
          <div class="order-items mb-2">
            <h5>Товары</h5>
            <div class="table-responsive">
              <table class="table table-sm order-table">
                <thead>
                  <tr>
                    <th>Название товара</th>
                    <th>Количество</th>
                    <th>Цена</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.items" :key="item.product_id">
                    <td>
                      <router-link :to="`/product?good_id=${item.product_id}`">{{ item.productName || `Товар ${item.product_id}` }}</router-link>
                    </td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.price }} сом</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="delivery-info d-flex align-items-start mt-3">
            <i class="bi bi-truck" style="font-size:1.5rem;color:#b89b7a;margin-right:10px;"></i>
            <div>
              <h5 class="mb-2">Информация о доставке</h5>
              <p class="mb-1"><strong>Имя:</strong> {{ order.info.first_name }} {{ order.info.last_name }}</p>
              <p class="mb-1"><strong>Адрес:</strong> {{ order.info.address_line1 }}, {{ order.info.city }}, {{ order.info.region }}, {{ order.info.postal_code }}</p>
              <p class="mb-1"><strong>Телефон:</strong> {{ order.info.phone }}</p>
              <p v-if="order.info.order_note" class="mb-1"><strong>Примечание:</strong> {{ order.info.order_note }}</p>
            </div>
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

const { user, isAuthenticated, checkAuth } = useAuth()
const orders = ref([])
const loading = ref(true)
const router = useRouter()

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

async function fetchProductName(productId) {
  try {
    const res = await fetch(`${window.AppConfig.siteUrl}/products/${productId}`)
    if (!res.ok) return `Товар ${productId}`
    const product = await res.json()
    return product.fashion_name || `Товар ${productId}`
  } catch {
    return `Товар ${productId}`
  }
}

async function fetchOrders(sessionId) {
  const url = `${window.AppConfig.siteUrl}/orders/?session_id=${sessionId}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch orders')
  const ordersData = await res.json()
  // Для каждого заказа подгружаем имена товаров
  for (const order of ordersData) {
    order.items = await Promise.all(order.items.map(async item => {
      const productName = await fetchProductName(item.product_id)
      return { ...item, productName }
    }))
  }
  return ordersData
}

onMounted(async () => {
  loading.value = true
  const sessionId = localStorage.getItem('session_id')
  if (!sessionId) {
    router.replace('/login')
    return
  }
  try {
    orders.value = await fetchOrders(sessionId)
  } catch {
    orders.value = []
  } finally {
    loading.value = false
  }
  document.title = 'Мои заказы | Nursace'
})
</script>

<style scoped>
.orders-container {
  margin-top: 20px;
}
.order-card {
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 24px 22px 18px 22px;
  margin-bottom: 28px;
  background: #fff;
  border: 1px solid #f2f2f2;
  transition: box-shadow 0.18s, transform 0.18s;
}
.order-card:hover {
  box-shadow: 0 6px 24px rgba(180,155,120,0.13);
  transform: translateY(-2px) scale(1.01);
}
.order-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 10px;
}
.order-id {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}
.order-status-badge {
  font-size: 1rem;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 12px;
  background: #ececec;
  color: #888;
  margin-left: 10px;
  display: inline-block;
}
.badge-processing { background: #fffbe6; color: #b89b7a; }
.badge-success { background: #e6fbe6; color: #2e7d32; }
.badge-fail { background: #ffd6d6; color: #b71c1c; }
.order-info {
  display: flex;
  gap: 24px;
  font-size: 1.08rem;
  color: #666;
  margin-bottom: 8px;
}
.order-date i, .order-total i {
  color: #b89b7a;
  margin-right: 4px;
}
.order-table th, .order-table td {
  vertical-align: middle;
  text-align: center;
}
.order-table th {
  font-weight: 600;
  background: #f8f8f8;
}
.order-table td {
  background: #fff;
}
.delivery-info {
  background: #f8f8f8;
  border-radius: 10px;
  padding: 14px 16px;
  margin-top: 10px;
  font-size: 1.05rem;
}
@media (max-width: 768px) {
  .order-card {
    padding: 14px 6px 12px 6px;
  }
  .order-info {
    flex-direction: column;
    gap: 8px;
  }
  .delivery-info {
    font-size: 0.98rem;
    padding: 10px 7px;
  }
}
</style> 
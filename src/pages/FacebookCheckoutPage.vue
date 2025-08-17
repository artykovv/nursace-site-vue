<template>
  <div class="container py-5">
    <h2 class="mb-5">Оформление заказа</h2>
    
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <div class="mt-3 text-muted">Загружаем товары...</div>
    </div>
    
    <!-- Adding to cart state -->
    <div v-else-if="addingToCart" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Добавляем в корзину...</span>
      </div>
      <div class="mt-3 text-muted">Добавляем товары в корзину...</div>
      <div class="mt-2 small text-muted">{{ addedItems }}/{{ cart.length }} товаров добавлено</div>
      
      <!-- Progress bar -->
      <div class="mt-3" style="max-width: 300px; margin: 0 auto;">
        <div class="progress" style="height: 8px;">
          <div 
            class="progress-bar bg-primary" 
            role="progressbar" 
            :style="{ width: `${(addedItems / cart.length) * 100}%` }"
            :aria-valuenow="addedItems"
            :aria-valuemin="0"
            :aria-valuemax="cart.length"
          ></div>
        </div>
      </div>
      
      <!-- Current product being added -->
      <div v-if="cart[addedItems]" class="mt-3 small text-muted">
        Добавляем: {{ cart[addedItems].good_name }}
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>
    
    <!-- Cart content -->
    <div v-else-if="cart.length > 0" class="row g-5 mt-3">
      <!-- Cart items -->
      <div class="col-md-5 col-lg-4 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-primary">Ваша корзина</span>
          <span class="badge bg-primary rounded-pill">{{ cart.length }}</span>
        </h4>
        <ul class="list-group mb-3">
          <li v-for="item in cart" :key="item.product_id" class="list-group-item d-flex justify-content-between lh-sm">
            <div>
              <h6 class="my-0">{{ item.good_name }}</h6>
              <small class="text-body-secondary">Количество: {{ item.quantity }}</small>
              <div v-if="item.articul" class="small text-muted">Артикул: {{ item.articul }}</div>
            </div>
            <span class="text-body-secondary">{{ (item.price * item.quantity).toFixed(2) }} сом</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Итого</span>
            <strong>{{ total.toFixed(2) }} сом</strong>
          </li>
        </ul>
        
        <!-- Checkout button -->
        <div class="d-grid gap-2">
          <button 
            @click="goToCheckout" 
            class="btn btn-primary btn-lg"
            :disabled="!cartReady"
          >
            <i class="bi bi-credit-card me-2"></i>
            Оформить заказ
          </button>
          <div v-if="!cartReady" class="text-center small text-muted">
            Товары добавляются в корзину...
          </div>
        </div>
      </div>
      
      <!-- Product details -->
      <div class="col-md-7 col-lg-8">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Товары в заказе</h5>
          </div>
          <div class="card-body">
            <div v-for="item in cart" :key="item.product_id" class="row mb-4 align-items-center">
              <!-- Product image -->
              <div class="col-md-3">
                <img 
                  v-if="item.images && item.images.length > 0" 
                  :src="item.images[0].image_url" 
                  :alt="item.good_name"
                  class="img-fluid rounded"
                  style="max-height: 100px; object-fit: cover;"
                />
                <div v-else class="bg-light rounded d-flex align-items-center justify-content-center" style="height: 100px;">
                  <span class="text-muted">Нет фото</span>
                </div>
              </div>
              
              <!-- Product info -->
              <div class="col-md-6">
                <h6 class="mb-1">{{ item.good_name }}</h6>
                <div v-if="item.articul" class="text-muted small mb-2">Артикул: {{ item.articul }}</div>
                <div v-if="item.description" class="text-muted small mb-2">{{ item.description }}</div>
                <div class="d-flex align-items-center gap-2">
                  <span class="fw-bold text-primary">{{ item.price.toFixed(2) }} сом</span>
                  <span class="text-muted">× {{ item.quantity }}</span>
                  <span class="fw-bold">= {{ (item.price * item.quantity).toFixed(2) }} сом</span>
                </div>
              </div>
              
              <!-- Quantity and total -->
              <div class="col-md-3 text-end">
                <div class="fw-bold text-primary">{{ (item.price * item.quantity).toFixed(2) }} сом</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Order summary -->
        <div class="card mt-4">
          <div class="card-header">
            <h5 class="mb-0">Итоги заказа</h5>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <span>Количество товаров:</span>
              <span>{{ totalItems }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Сумма:</span>
              <span>{{ total.toFixed(2) }} сом</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between fw-bold">
              <span>Итого к оплате:</span>
              <span class="text-primary">{{ total.toFixed(2) }} сом</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty cart -->
    <div v-else class="text-center py-5">
      <div class="alert alert-info">
        Корзина пуста или товары не найдены
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const cart = ref([])
const loading = ref(true)
const addingToCart = ref(false)
const error = ref('')
const addedItems = ref(0)
const cartReady = ref(false)

// Computed properties
const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const totalItems = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0)
})

// Parse products query parameter
function parseProductsQuery(queryString) {
  if (!queryString) return []
  
  try {
    // First decode the URL-encoded string
    const decoded = decodeURIComponent(queryString)
    console.log('Decoded query:', decoded) // Debug log
    
    // Split by comma to get individual product:quantity pairs
    const pairs = decoded.split(',')
    console.log('Product pairs:', pairs) // Debug log
    
    const result = []
    
    for (const pair of pairs) {
      // Split each pair by colon to get product_id and quantity
      const [idStr, qtyStr] = pair.split(':')
      console.log('Parsing pair:', pair, 'id:', idStr, 'qty:', qtyStr) // Debug log
      
      const productId = parseInt(idStr)
      const quantity = parseInt(qtyStr) || 1
      
      if (productId && quantity > 0) {
        result.push({ product_id: productId, quantity })
        console.log('Added product:', { product_id: productId, quantity }) // Debug log
      } else {
        console.warn('Invalid product pair:', pair, 'id:', idStr, 'qty:', qtyStr) // Debug log
      }
    }
    
    console.log('Final result:', result) // Debug log
    return result
  } catch (e) {
    console.error('Error parsing products query:', e)
    return []
  }
}

// Fetch product details from API
async function fetchProductDetails(productId) {
  try {
    const url = `${window.AppConfig.siteUrl}/products/${productId}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product ${productId}`)
    }
    
    const product = await response.json()
    return {
      product_id: productId,
      good_name: product.good_name || product.name || 'Товар',
      articul: product.articul || '',
      description: product.description || '',
      price: product.retail_price_with_discount || product.retail_price || 0,
      images: product.images || [],
      quantity: 0 // Will be set from query
    }
  } catch (e) {
    console.error(`Error fetching product ${productId}:`, e)
    return null
  }
}

// Add all products to cart
async function addProductsToCart() {
  try {
    addingToCart.value = true
    addedItems.value = 0
    
    console.log('Starting to add products to cart:', cart.value.length, 'products') // Debug log
    
    for (const item of cart.value) {
      try {
        console.log(`Adding product ${item.product_id} (${item.good_name}) with quantity ${item.quantity}`) // Debug log
        
        // Use direct cart API call instead of debounced addToCart
        await addProductToCartDirectly(item.product_id, item.quantity)
        addedItems.value++
        
        console.log(`Successfully added product ${item.product_id}, progress: ${addedItems.value}/${cart.value.length}`) // Debug log
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 200))
      } catch (e) {
        console.error(`Failed to add product ${item.product_id} to cart:`, e)
        // Continue with other products even if one fails
        // But still increment counter to show progress
        addedItems.value++
      }
    }
    
    console.log('Finished adding products to cart. Total added:', addedItems.value) // Debug log
    cartReady.value = true
    
  } catch (e) {
    console.error('Error adding products to cart:', e)
    error.value = 'Ошибка при добавлении товаров в корзину'
  } finally {
    addingToCart.value = false
  }
}

// Direct cart addition function (bypasses debounce)
async function addProductToCartDirectly(productId, quantity) {
  try {
    // Get session ID directly
    let sessionId = null
    if (window.getSessionId) {
      sessionId = window.getSessionId()
    }
    
    if (!sessionId) {
      // Try to get from auth param
      if (window.getAuthParam) {
        const param = await window.getAuthParam()
        if (param.startsWith('session_id=')) {
          sessionId = param.split('=')[1]
        }
      }
    }
    
    if (!sessionId) {
      throw new Error('No session ID available')
    }
    
    console.log(`Adding to cart directly: product_id=${productId}, quantity=${quantity}, session_id=${sessionId}`)
    
    const payload = {
      product_id: productId,
      quantity: quantity,
      session_id: sessionId
    }
    
    const response = await fetch(`${window.AppConfig.siteUrl}/cart/v2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Cart API error: ${response.status} - ${errorText}`)
    }
    
    const result = await response.json()
    console.log(`Cart API response for product ${productId}:`, result)
    
    return result
  } catch (error) {
    console.error(`Direct cart addition failed for product ${productId}:`, error)
    throw error
  }
}

// Load cart from query parameters
async function loadCart() {
  try {
    loading.value = true
    error.value = ''
    
    const productsQuery = route.query.products
    if (!productsQuery) {
      error.value = 'Не указаны товары для заказа'
      return
    }
    
    const productPairs = parseProductsQuery(productsQuery)
    if (productPairs.length === 0) {
      error.value = 'Неверный формат параметра products'
      return
    }
    
    // Fetch all products
    const cartItems = []
    for (const { product_id, quantity } of productPairs) {
      const product = await fetchProductDetails(product_id)
      if (product) {
        product.quantity = quantity
        cartItems.push(product)
      }
    }
    
    cart.value = cartItems
    
    if (cartItems.length === 0) {
      error.value = 'Не удалось загрузить товары'
      return
    }
    
    // After loading products, add them to cart
    await addProductsToCart()
    
  } catch (e) {
    console.error('Error loading cart:', e)
    error.value = 'Ошибка загрузки корзины'
  } finally {
    loading.value = false
  }
}

// Navigate to checkout page
function goToCheckout() {
  if (cartReady.value) {
    router.push('/checkout')
  }
}

onMounted(() => {
  document.title = 'Оформление заказа | Nursace'
  loadCart()
})
</script>

<style scoped>
.badge {
  background: #cdb5a7 !important;
}

.card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.text-primary {
  color: #cdb5a7 !important;
}

.fw-bold {
  font-weight: 600 !important;
}

.img-fluid {
  max-width: 100%;
  height: auto;
}

.rounded {
  border-radius: 8px !important;
}

.list-group-item {
  border-left: none;
  border-right: none;
}

.list-group-item:first-child {
  border-top: none;
}

.list-group-item:last-child {
  border-bottom: none;
}

.btn-primary {
  background: #cdb5a7;
  border: none;
}

.btn-primary:hover, .btn-primary:focus {
  background: #b89b7a;
}

.btn-primary:disabled {
  background: #6c757d;
  opacity: 0.65;
}

.progress {
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  background: #cdb5a7 !important;
  transition: width 0.3s ease;
}

.bg-primary {
  background-color: #cdb5a7 !important;
}
</style> 
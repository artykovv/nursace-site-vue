<template>
  <div class="container">
    <h2 class="mb-4">Результаты поиска</h2>
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
    </div>
    <div v-else-if="!products.length" class="alert alert-info text-center">
      Ничего не найдено по запросу "{{ searchQuery }}"
    </div>
    <div v-else class="products_container">
      <ProductCard v-for="product in products" :key="product.good_id" :product="product" />
    </div>
    <div class="d-flex justify-content-center mt-4">
      <button v-if="!allLoaded && !loading && products.length" class="btn btn-outline-primary" @click="loadMore" :disabled="loadingMore">
        <span v-if="loadingMore" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Загрузить еще
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const products = ref([])
const loading = ref(false)
const searchQuery = ref('')
const offset = ref(0)
const limit = ref(20)
const allLoaded = ref(false)
const loadingMore = ref(false)

async function fetchProducts(append = false) {
  const q = route.query.query || ''
  searchQuery.value = q
  if (!q) {
    products.value = []
    allLoaded.value = true
    return
  }
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }
  try {
    const url = `${window.AppConfig.siteUrl}/products/?search=${encodeURIComponent(q)}&offset=${offset.value}&limit=${limit.value}`
    const res = await fetch(url)
    const newProducts = await res.json()
    if (append) {
      products.value.push(...newProducts)
    } else {
      products.value = newProducts
    }
    allLoaded.value = newProducts.length < limit.value
  } catch (e) {
    if (!append) products.value = []
    allLoaded.value = true
  } finally {
    if (append) {
      loadingMore.value = false
    } else {
      loading.value = false
    }
  }
}
function loadMore() {
  offset.value += limit.value
  fetchProducts(true)
}
watch(() => route.query.query, () => {
  offset.value = 0
  allLoaded.value = false
  fetchProducts(false)
}, { immediate: true })

onMounted(() => { document.title = 'Поиск | Nursace' })
</script>

<style scoped>
.products_container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 18px;
  padding: 0;
  margin-bottom: 32px;
  min-height: 300px;
}
@media (max-width: 900px) {
  .products_container {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 2px 2px 12px 2px;
  }
}
@media (max-width: 480px) {
  .products_container {
    gap: 8px;
    padding: 2px 0 12px 0;
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style> 
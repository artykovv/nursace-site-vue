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

async function fetchProducts() {
  const q = route.query.query || ''
  searchQuery.value = q
  if (!q) {
    products.value = []
    return
  }
  loading.value = true
  try {
    const url = `${window.AppConfig.siteUrl}/products/?search=${encodeURIComponent(q)}`
    const res = await fetch(url)
    products.value = await res.json()
  } catch (e) {
    products.value = []
  } finally {
    loading.value = false
  }
}

watch(() => route.query.query, fetchProducts, { immediate: true })

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
<template>
  <div class="container" style="margin-top: 150px;">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
    </div>
    <div v-else class="row g-5">
      <div class="col-md-4 p-3 d-none d-md-block">
        <div class="sticky-top">
          <p>hello world</p>
          <CategoryFilters :onUpdate="updateFilters" />
        </div>
      </div>
      <div class="col-12 col-md-8">
        <div class="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
          <PriceSort :sortBy="sortBy" @updateSort="updateSort" />
          <MobileFilters :onUpdate="updateFilters" />
        </div>
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 products_container">
          <div v-for="product in products" :key="product.good_id" class="col">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import CategoryFilters from '../components/CategoryFilters.vue'
import MobileFilters from '../components/MobileFilters.vue'
import PriceSort from '../components/PriceSort.vue'
import ProductCard from '../components/ProductCard.vue'

const products = ref([])
const filters = ref({})
const sortBy = ref('desc')
const route = useRoute()
const loading = ref(true)

function updateFilters(newFilters) {
  filters.value = newFilters
}
function updateSort(newSort) {
  sortBy.value = newSort
}
function buildParams() {
  const params = new URLSearchParams()
  if (route.params.id) {
    params.append('category_id', route.params.id)
  }
  for (const [key, value] of Object.entries(route.query)) {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v))
    } else if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  }
  for (const [key, value] of Object.entries(filters.value)) {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v))
    } else if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  }
  params.append('sort_by_price', sortBy.value)
  return params
}
async function fetchProducts() {
  loading.value = true
  try {
    const params = buildParams()
    const url = `${window.AppConfig.siteUrl}/products/?${params.toString()}`
    const res = await fetch(url)
    products.value = await res.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}
watch([() => route.params.id, () => route.query, filters, sortBy], fetchProducts, { deep: true, immediate: true })
</script>
<style scoped>
.products_container {
  min-height: 300px;
}
@media (max-width: 576px) {
  .products_container {
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
  }
}
</style> 
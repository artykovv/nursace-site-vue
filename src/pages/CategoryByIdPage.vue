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
        <div class="d-flex justify-content-center mt-4">
          <button v-if="!allLoaded && !loading && products.length" class="btn btn-outline-primary" @click="loadMore" :disabled="loadingMore">
            <span v-if="loadingMore" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Загрузить еще
          </button>
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
const offset = ref(0)
const limit = ref(20)
const allLoaded = ref(false)
const loadingMore = ref(false)

function updateFilters(newFilters) {
  filters.value = newFilters
  offset.value = 0
  allLoaded.value = false
}
function updateSort(newSort) {
  sortBy.value = newSort
  offset.value = 0
  allLoaded.value = false
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
  params.append('offset', offset.value)
  params.append('limit', limit.value)
  return params
}
async function fetchProducts(append = false) {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }
  try {
    const params = buildParams()
    const url = `${window.AppConfig.siteUrl}/products/?${params.toString()}`
    const res = await fetch(url)
    const newProducts = await res.json()
    if (append) {
      products.value.push(...newProducts)
    } else {
      products.value = newProducts
    }
    allLoaded.value = newProducts.length < limit.value
  } catch (error) {
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
watch([
  () => route.params.id,
  () => route.query,
  filters,
  sortBy
], () => {
  offset.value = 0
  allLoaded.value = false
  fetchProducts(false)
}, { deep: true, immediate: true })
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
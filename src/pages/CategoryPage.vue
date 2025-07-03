<template>
  <div v-if="loading" class="categorypage-loader">
    <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
  </div>
  <div v-else>
    <div class="categorypage-root">
      <div class="categorypage-content">
        <aside class="categorypage-filters">
          <CategoryFilters :onUpdate="updateFilters" />
        </aside>
        <main class="categorypage-main">
          <div class="categorypage-controls">
            <PriceSort :sortBy="sortBy" @updateSort="updateSort" />
            <MobileFilters :onUpdate="updateFilters" />
          </div>
          <div class="categorypage-products">
            <div v-for="product in products" :key="product.good_id" class="categorypage-product-item">
              <ProductCard :product="product" />
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
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

// Debounce функция (можно заменить на lodash.debounce)
function debounce(fn, wait) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), wait)
  }
}

function updateFilters(newFilters) {
  filters.value = newFilters
}
function updateSort(newSort) {
  sortBy.value = newSort
}
function buildParams() {
  const params = new URLSearchParams()
  // query-параметры (category, brand, collection, season и т.д.)
  for (const [key, value] of Object.entries(route.query)) {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v))
    } else if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  }
  // фильтры из UI
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
  try {
    const params = buildParams()
    const url = `${window.AppConfig.siteUrl}/products/?${params.toString()}`
    const res = await fetch(url)
    products.value = await res.json()
  } catch (error) {
    products.value = []
  } finally {
    loading.value = false
  }
}
const debouncedFetchProducts = debounce(fetchProducts, 400)
watch([() => route.query, filters, sortBy], debouncedFetchProducts, { deep: true, immediate: true })

onMounted(() => { document.title = 'Каталог | Nursace' })
</script>

<style scoped>
.categorypage-root {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 8px;
}
.categorypage-content {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}
.categorypage-filters {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 90px;
  display: block;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: #cdb5a7 #f5f5f5;
}
/* Стилизация скроллбара для Webkit */
.categorypage-filters::-webkit-scrollbar {
  width: 7px;
  background: #f5f5f5;
}
.categorypage-filters::-webkit-scrollbar-thumb {
  background: #cdb5a7;
  border-radius: 6px;
}
.categorypage-main {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.categorypage-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  margin-bottom: 18px;
  justify-content: space-between;
}
.categorypage-products {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
.categorypage-product-item {
  width: 100%;
  min-width: 0;
}
.categorypage-loader {
  width: 100vw;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* --- MOBILE STYLES --- */
@media (max-width: 900px) {
  .categorypage-content {
    flex-direction: column;
    gap: 0;
  }
  .categorypage-filters {
    display: none;
  }
  .categorypage-main {
    width: 100%;
  }
}
@media (max-width: 700px) {
  .categorypage-root {
    padding: 0 2px;
  }
  .categorypage-controls {
    gap: 8px;
    margin-bottom: 10px;
    padding: 0 2px;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 10;
    border-radius: 0 0 14px 14px;
  }
  .categorypage-products {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 2px 2px 12px 2px;
  }
  .categorypage-product-item {
    min-width: 0;
    width: 100%;
    transition: box-shadow 0.18s;
  }
}
@media (max-width: 480px) {
  .categorypage-products {
    gap: 8px;
    padding: 2px 0 12px 0;
    margin-left: 10px;
    margin-right: 10px;
  }
  .categorypage-filters {
    border-radius: 0 0 12px 12px;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.03);
    padding-bottom: 4px;
  }
  .categorypage-controls {
    border-radius: 0 0 10px 10px;
    padding-bottom: 2px;
  }
}
</style>

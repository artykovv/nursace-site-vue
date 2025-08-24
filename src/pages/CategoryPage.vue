<template>
  <div class="category-page-layout container">
    <!-- Левая часть: Фильтры -->
    <div class="filters-section">
      <h5>Фильтры</h5>
      <!-- Цвета -->
      <div v-if="filters.colors && filters.colors.length" class="mb-3">
        <div class="fw-semibold mb-1">Цвет</div>
        <label v-for="color in filters.colors" :key="color.id" class="d-block mb-1">
          <input type="checkbox" :value="color.id" v-model="selectedFilters.color_id" @change="onFilterChange" />
          {{ color.name }}
        </label>
      </div>
      <!-- Размеры -->
      <div v-if="filters.sizes && filters.sizes.length" class="mb-3">
        <div class="fw-semibold mb-1">Размер</div>
        <label v-for="size in filters.sizes" :key="size.value" class="d-block mb-1">
          <input type="checkbox" :value="size.value" v-model="selectedFilters.product_size" @change="onFilterChange" />
          {{ size.value }}
        </label>
      </div>
      <!-- Пол -->
      <div v-if="filters.sexes && filters.sexes.length" class="mb-3">
        <div class="fw-semibold mb-1">Пол</div>
        <label v-for="sex in filters.sexes" :key="sex.id" class="d-block mb-1">
          <input type="checkbox" :value="sex.id" v-model="selectedFilters.sex_id" @change="onFilterChange" />
          {{ sex.name }}
        </label>
      </div>
      <!-- Производители -->
      <div v-if="filters.manufacturers && filters.manufacturers.length" class="mb-3">
        <div class="fw-semibold mb-1">Производитель</div>
        <label v-for="man in filters.manufacturers" :key="man.id" class="d-block mb-1">
          <input type="checkbox" :value="man.id" v-model="selectedFilters.manufacturer_id" @change="onFilterChange" />
          {{ man.name }}
        </label>
      </div>
      <!-- Коллекции -->
      <div v-if="filters.collections && filters.collections.length" class="mb-3">
        <div class="fw-semibold mb-1">Коллекция</div>
        <label v-for="col in filters.collections" :key="col.id" class="d-block mb-1">
          <input type="checkbox" :value="col.id" v-model="selectedFilters.collection_id" @change="onFilterChange" />
          {{ col.name }}
        </label>
      </div>
    </div>
    <!-- Offcanvas фильтры для мобильных -->
    <div v-if="showFilters" class="mobile-filters-offcanvas d-md-none">
      <div class="offcanvas-backdrop" @click="showFilters = false"></div>
      <div class="offcanvas-content">
        <button class="btn-close" @click="showFilters = false" aria-label="Закрыть фильтры">&times;</button>
        <h5>Фильтры</h5>
        <div v-if="filters.colors && filters.colors.length" class="mb-3">
          <div class="fw-semibold mb-1">Цвет</div>
          <label v-for="color in filters.colors" :key="color.id" class="d-block mb-1">
            <input type="checkbox" :value="color.id" v-model="selectedFilters.color_id" @change="onFilterChange" />
            {{ color.name }}
          </label>
        </div>
        <div v-if="filters.sizes && filters.sizes.length" class="mb-3">
          <div class="fw-semibold mb-1">Размер</div>
          <label v-for="size in filters.sizes" :key="size.value" class="d-block mb-1">
            <input type="checkbox" :value="size.value" v-model="selectedFilters.product_size" @change="onFilterChange" />
            {{ size.value }}
          </label>
        </div>
        <div v-if="filters.sexes && filters.sexes.length" class="mb-3">
          <div class="fw-semibold mb-1">Пол</div>
          <label v-for="sex in filters.sexes" :key="sex.id" class="d-block mb-1">
            <input type="checkbox" :value="sex.id" v-model="selectedFilters.sex_id" @change="onFilterChange" />
            {{ sex.name }}
          </label>
        </div>
        <div v-if="filters.manufacturers && filters.manufacturers.length" class="mb-3">
          <div class="fw-semibold mb-1">Производитель</div>
          <label v-for="man in filters.manufacturers" :key="man.id" class="d-block mb-1">
            <input type="checkbox" :value="man.id" v-model="selectedFilters.manufacturer_id" @change="onFilterChange" />
            {{ man.name }}
          </label>
        </div>
        <div v-if="filters.collections && filters.collections.length" class="mb-3">
          <div class="fw-semibold mb-1">Коллекция</div>
          <label v-for="col in filters.collections" :key="col.id" class="d-block mb-1">
            <input type="checkbox" :value="col.id" v-model="selectedFilters.collection_id" @change="onFilterChange" />
            {{ col.name }}
          </label>
        </div>
      </div>
    </div>
    <!-- Правая часть: Товары -->
    <div class="products-section">
      <!-- Кнопка фильтры для мобильных -->
      <button class="btn btn-outline-primary d-md-none mb-3" @click="showFilters = true" style="width: 100%;">
        <i class="bi bi-funnel"></i> Фильтры
      </button>
      <div class="sort-section mb-3">
        <span @click="onSortChange('asc')" :class="{active: sort_by_price==='asc'}">
          <i class="bi bi-arrow-up sort-icon" :class="{active: sort_by_price==='asc'}"></i>
          По возрастанию
        </span>
        <span @click="onSortChange('desc')" :class="{active: sort_by_price==='desc'}" style="margin-left: 12px;">
          <i class="bi bi-arrow-down sort-icon" :class="{active: sort_by_price==='desc'}"></i>
          По убыванию
        </span>
      </div>
      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
      </div>
      <div v-else>
        <div v-if="products.length" class="products_container">
          <ProductCard v-for="product in products" :key="product.good_id" :product="product" />
        </div>
        <div v-else>Нет товаров</div>
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

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'

const offset = ref(0)
const limit = ref(20)
const loadingMore = ref(false)
const allLoaded = ref(false)
const showFilters = ref(false)

export default {
  components: { ProductCard },
  setup() {
    const route = useRoute()
    const products = ref([])
    const filters = ref({})
    const loading = ref(false)
    const sort_by_price = ref(null)
    // Собираем выбранные фильтры
    const selectedFilters = ref({
      category_id: route.query.category_id ? [Number(route.query.category_id)] : [],
      manufacturer_id: route.query.manufacturer_id ? [Number(route.query.manufacturer_id)] : [],
      collection_id: route.query.collection_id ? [Number(route.query.collection_id)] : [],
      season_id: route.query.season_id ? [Number(route.query.season_id)] : [],
      custom_category_id: route.query.custom_category_id ? [Number(route.query.custom_category_id)] : [],
      color_id: [],
      sex_id: route.query.sex_id && [Number(route.query.sex_id)],
      product_size: [],
      discounts: route.query.discounts === 'true' ? true : undefined,
      discount_id: route.query.discount_id ? Number(route.query.discount_id) : undefined,
      outlet_id: route.query.outlet_id ? Number(route.query.outlet_id) : undefined,
      // ... другие фильтры
    })

    // Получить фильтры
    const fetchFilters = async () => {
      const params = new URLSearchParams()
      if (selectedFilters.value.category_id.length) params.append('category_id', selectedFilters.value.category_id[0])
      if (selectedFilters.value.manufacturer_id.length) params.append('manufacturer_id', selectedFilters.value.manufacturer_id[0])
      if (selectedFilters.value.collection_id.length) params.append('collection_id', selectedFilters.value.collection_id[0])
      if (selectedFilters.value.season_id.length) params.append('season_id', selectedFilters.value.season_id[0])
      if (selectedFilters.value.custom_category_id.length) params.append('custom_category_id', selectedFilters.value.custom_category_id[0])
      if (selectedFilters.value.discount_id) params.append('discount_id', selectedFilters.value.discount_id)
      if (selectedFilters.value.outlet_id) params.append('outlet_id', selectedFilters.value.outlet_id)
      if (selectedFilters.value.discounts === true) params.append('discounts', 'true')
      const res = await fetch(`${window.AppConfig.siteUrl}/filters/v3/?${params}`)
      filters.value = await res.json()
    }

    // Получить товары с поддержкой пагинации
    const fetchProducts = async (append = false) => {
      if (append) {
        loadingMore.value = true
      } else {
        loading.value = true
        offset.value = 0
        allLoaded.value = false
      }
      const params = new URLSearchParams()
      Object.entries(selectedFilters.value).forEach(([key, val]) => {
        if (key === 'discounts') {
          if (val === true) params.append('discounts', 'true')
          return
        }
        if (Array.isArray(val) && val.length) {
          val.forEach(v => {
            if (v !== null && v !== undefined && v !== '') params.append(key, v)
          })
        } else if (val !== null && val !== undefined && val !== '' && !(Array.isArray(val) && val.length === 0)) {
          params.append(key, val)
        }
      })
      if (sort_by_price.value) params.append('sort_by_price', sort_by_price.value)
      params.append('offset', offset.value)
      params.append('limit', limit.value)
      const res = await fetch(`${window.AppConfig.siteUrl}/products/v3/?${params}`)
      const newProducts = await res.json()
      if (append) {
        products.value.push(...newProducts)
      } else {
        products.value = newProducts
      }
      allLoaded.value = newProducts.length < limit.value
      if (append) {
        loadingMore.value = false
      } else {
        loading.value = false
      }
    }

    // При изменении фильтра
    const onFilterChange = () => {
      offset.value = 0
      allLoaded.value = false
      fetchProducts(false)
    }

    // При изменении сортировки
    const onSortChange = (sort) => {
      sort_by_price.value = sort
      offset.value = 0
      allLoaded.value = false
      fetchProducts(false)
    }

    const loadMore = () => {
      offset.value += limit.value
      fetchProducts(true)
    }

    onMounted(async () => {
      await fetchFilters()
      await fetchProducts(false)
    })

    // Следить за изменением фильтров
    watch(selectedFilters, () => {
      offset.value = 0
      allLoaded.value = false
      fetchProducts(false)
    }, { deep: true })

    return {
      products,
      filters,
      loading,
      selectedFilters,
      sort_by_price,
      onFilterChange,
      onSortChange,
      loadMore,
      loadingMore,
      allLoaded,
      showFilters
    }
  }
}
</script>

<style scoped>
.category-page-layout {
  display: flex;
  gap: 32px;
}
.category-page-layout.container {
  position: relative;
}

.filters-section {
  min-width: 220px;
  max-width: 260px;
  background: #faf8f6;
  border-radius: 1rem;
  padding: 18px 18px 18px 18px;
  box-shadow: 0 2px 12px rgba(200,180,140,0.06);
  height: fit-content;
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}
.products-section {
  flex: 1 1 0%;
  padding-left: 0;
}
.products_container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
  padding: 0;
  margin-bottom: 32px;
  min-height: 300px;
}
.sort-section {
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  margin-bottom: 18px;
  background: linear-gradient(#fff,#fff),linear-gradient(90deg,#cdb5a7 0,#b89b7a);
  border-radius: 0.7em;
  display: flex;
  align-items: center;
  gap: 18px;
  padding-top: 12px;
  padding-left: 18px;
  padding-right: 18px;
  transition: background 0.2s;
}
.sort-section span {
  color: #40474f;
  font-weight: 600;
  font-size: 1.08rem;
  cursor: pointer;
  padding: 6px 16px;
  border-radius: 1em;
  transition: color 0.18s, background 0.18s;
}
.sort-section span:hover {
  background: #f5ede5;
  color: #b89b7a;
}
.sort-section span.active,
.sort-section span[style*='bold'] {
  color: #ffffff !important;
  background: linear-gradient(90deg,#cdb5a7 0,#b89b7a 100%);
  box-shadow: 0 2px 8px rgba(200,180,140,0.08);
}
.sort-icon {
  font-size: 1.1em;
  margin-right: 6px;
  color: #b89b7a;
  transition: color 0.18s;
}
.sort-section span.active .sort-icon {
  color: #fff;
}
@media (max-width: 1200px) {
  .products-section {
    margin-left: 0;
    padding-left: 0;
  }
  .products_container {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .category-page-layout {
    gap: 16px;
  }
}
@media (max-width: 900px) {
  .category-page-layout {
    flex-direction: column;
  }
  .filters-section {
    display: none;
    max-width: 100%;
    margin-bottom: 18px;
    position: static;
    left: unset;
    top: unset;
    transform: none;
    z-index: unset;
  }
  .products-section {
    margin-left: 0;
    padding-left: 0;
  }
  .products_container {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 2px 2px 12px 2px;
  }
  .mobile-filters-offcanvas {
    position: fixed;
    z-index: 1200;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    align-items: stretch;
  }
  .offcanvas-backdrop {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index: 1;
  }
  .offcanvas-content {
    position: relative;
    background: #fff;
    width: 90vw;
    max-width: 340px;
    height: 100vh;
    overflow-y: auto;
    box-shadow: 2px 0 16px rgba(0,0,0,0.08);
    padding: 18px 12px 18px 18px;
    z-index: 2;
    animation: slideInLeft 0.2s;
  }
  @keyframes slideInLeft {
    from { transform: translateX(-100%);} 
    to { transform: translateX(0);} 
  }
  .btn-close {
    position: absolute;
    right: 12px;
    top: 12px;
    background: none;
    border: none;
    font-size: 1.5em;
  }
}
@media (max-width: 480px) {
  .products_container {
    gap: 8px;
    padding: 2px 0 12px 0;
    margin-left: 10px;
    margin-right: 10px;
  }
  .sort-section span{
    font-size: 13px;
  }
}
</style>
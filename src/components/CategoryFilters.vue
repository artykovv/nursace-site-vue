<template>
  <div class="card p-3 filters">
    <h3 class="filters-title"><i class="bi bi-sliders"></i><span>Фильтры</span></h3>
    <div class="filter-section">
      <FilterGroup label="Цвет" :options="filters.colors" v-model="selected.color_id" />
      <FilterGroup label="Пол" :options="filters.sexes" v-model="selected.sex_id" />
      <FilterGroup label="Производитель" :options="filters.manufacturers" v-model="selected.manufacturer_id" />
      <FilterGroup label="Коллекция" :options="filters.collections" v-model="selected.collection_id" />
      <FilterGroup label="Размер" :options="filters.sizes" v-model="selected.product_size" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import FilterGroup from './FilterGroup.vue'
const props = defineProps({
  onUpdate: Function,
  baseParams: { type: Object, default: () => ({}) }
})
const filters = ref({ colors: [], sexes: [], manufacturers: [], collections: [], sizes: [] })
const selected = ref({ color_id: [], sex_id: [], manufacturer_id: [], collection_id: [], product_size: [] })

async function loadFilters(params = {}) {
  try {
    const url = new URL(`${window.AppConfig.siteUrl}/filters/`)
    const allParams = { ...props.baseParams, ...params }
    Object.entries(allParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v))
      } else if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value)
      }
    })
    const res = await fetch(url)
    const data = await res.json()
    filters.value.colors = data.colors || []
    filters.value.sexes = data.sexes || []
    filters.value.manufacturers = data.manufacturers || []
    filters.value.collections = data.collections || []
    filters.value.sizes = (data.sizes || []).map(s => ({ id: s.value, name: s.value }))
  } catch (e) { console.error(e) }
}

onMounted(() => loadFilters(selected.value))

watch(selected, val => {
  props.onUpdate({ ...val })
  loadFilters(val)
}, { deep: true })

watch(() => props.baseParams, () => {
  loadFilters(selected.value)
}, { deep: true })
</script>

<style scoped>
.filters-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.18rem;
  font-weight: 700;
  color: #b89b7a;
  margin: 0 0 12px 0;
  justify-content: center;
}
.filters-title i {
  font-size: 1.3em;
  color: #b89b7a;
}
.categorypage-filters {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 90px;
  display: block;
  max-height: calc(100vh - 100px); /* или другое значение */
  overflow-y: auto;
  overscroll-behavior: contain; /* чтобы скролл не прокручивал всю страницу */
  scrollbar-width: thin;
}
</style> 
<template>
  <section class="mobile-filters p-3 d-md-none" aria-label="Mobile sorting controls">
    <button class="modern-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileFiltersOffcanvas" aria-controls="mobileFiltersOffcanvas">
      <i class="bi bi-sliders"></i>
      <span>Фильтры</span>
    </button>
    <div class="offcanvas offcanvas-bottom offcanvas-mobile" tabindex="-1" id="mobileFiltersOffcanvas" aria-labelledby="mobileFiltersOffcanvasLabel" style="--bs-offcanvas-height: 80vh;">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title filters-title" id="mobileFiltersOffcanvasLabel">
          <i class="bi bi-sliders"></i>
          <span>Фильтры</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Закрыть"></button>
      </div>
      <div class="offcanvas-body">
        <div class="filter-section">
          <FilterGroup label="Цвет" :options="filters.colors" v-model="selected.color_id" />
          <FilterGroup label="Пол" :options="filters.sexes" v-model="selected.sex_id" />
          <FilterGroup label="Производитель" :options="filters.manufacturers" v-model="selected.manufacturer_id" />
          <FilterGroup label="Коллекция" :options="filters.collections" v-model="selected.collection_id" />
          <FilterGroup label="Размер" :options="filters.sizes" v-model="selected.product_size" />
        </div>
      </div>
    </div>
  </section>
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
.modern-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-width: 120px;
  min-height: 44px;
  padding: 0 26px;
  font-size: 1.09rem;
  font-weight: 600;
  border-radius: 2rem;
  border: 2px solid transparent;
  background: #fff;
  color: #b89b7a;
  box-shadow: 0 2px 12px 0 rgba(200,180,140,0.08);
  background-image: linear-gradient(#fff, #fff), linear-gradient(90deg,#cdb5a7 0,#b89b7a 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  transition: box-shadow 0.18s, background 0.18s, color 0.18s, transform 0.12s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.modern-btn i {
  font-size: 1.25em;
  color: #b89b7a;
  transition: color 0.18s;
}
.modern-btn:active, .modern-btn.active, .modern-btn[aria-expanded="true"] {
  background: linear-gradient(90deg,#cdb5a7 0,#b89b7a 100%);
  color: #fff;
  box-shadow: 0 6px 24px 0 rgba(200,180,140,0.18);
  transform: scale(0.97);
}
.modern-btn:active i, .modern-btn.active i, .modern-btn[aria-expanded="true"] i {
  color: #fff;
}
.modern-btn:focus-visible {
  outline: 2px solid #b89b7a;
  outline-offset: 2px;
}
.filter-section {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px 0 rgba(200,180,140,0.08);
  padding: 18px 12px 18px 12px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.filter-group h4 {
  font-size: 1.08rem;
  font-weight: 600;
  color: #b89b7a;
  margin-bottom: 8px;
  margin-top: 0;
}
.filter-group {
  margin-bottom: 0;
}
.form-check {
  margin-bottom: 7px;
  padding: 6px 0 6px 0;
  border-radius: 8px;
  transition: background 0.15s;
}
.form-check-input:focus {
  box-shadow: 0 0 0 2px #b89b7a33;
  border-color: #b89b7a;
}
.form-check-input:checked {
  background-color: #b89b7a;
  border-color: #b89b7a;
}
.form-check-label {
  font-size: 1rem;
  color: #40474f;
  padding-left: 6px;
  cursor: pointer;
}
.form-check:hover {
  background: #f8f5f1;
}
.filters-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.18rem;
  font-weight: 700;
  color: #b89b7a;
  margin: 0;
  justify-content: center;
}
.filters-title i {
  font-size: 1.3em;
  color: #b89b7a;
}
</style> 
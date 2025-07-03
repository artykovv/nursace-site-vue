<template>
  <div>
    <!-- Desktop -->
    <section class="filters price-sort-section" aria-label="Sorting controls">
      <div class="price-asc-desc">
        <button class="price-sort-btn" :class="{active: sortBy==='asc'}" @click="$emit('updateSort', 'asc')" aria-label="Сортировать по возрастанию">
          <i class="bi bi-arrow-up"></i>
          <span>По возрастанию</span>
        </button>
        <button class="price-sort-btn" :class="{active: sortBy==='desc'}" @click="$emit('updateSort', 'desc')" aria-label="Сортировать по убыванию">
          <i class="bi bi-arrow-down"></i>
          <span>По убыванию</span>
        </button>
      </div>
    </section>
    <!-- Mobile -->
    <section class="mobile-filters-sort" aria-label="Mobile sorting controls">
      <button class="modern-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#sortOffcanvas" aria-controls="sortOffcanvas">
        <i class="bi bi-funnel"></i>
        <span>Сортировка</span>
      </button>
      <div class="offcanvas offcanvas-bottom offcanvas-mobile" tabindex="-1" id="sortOffcanvas" aria-labelledby="sortOffcanvasLabel" style="--bs-offcanvas-height: 80vh;">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="sortOffcanvasLabel">Сортировка</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Закрыть"></button>
        </div>
        <div class="offcanvas-body">
          <div class="form-check">
            <input class="form-check-input mobile-sort" type="radio" name="sortOptions" id="sortAsc" value="asc" :checked="sortBy==='asc'" @change="$emit('updateSort', 'asc')">
            <label class="form-check-label" for="sortAsc"><i class="bi bi-arrow-up"></i> По возрастанию</label>
          </div>
          <div class="form-check">
            <input class="form-check-input mobile-sort" type="radio" name="sortOptions" id="sortDesc" value="desc" :checked="sortBy==='desc'" @change="$emit('updateSort', 'desc')">
            <label class="form-check-label" for="sortDesc"><i class="bi bi-arrow-down"></i> По убыванию</label>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
const props = defineProps({ sortBy: String })
</script>
<style scoped>
.price-sort-section {
  padding: 0;
}
.price-asc-desc {
  display: flex;
  gap: 14px;
  margin-bottom: 8px;
}
.price-sort-btn {
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
.price-sort-btn i {
  font-size: 1.25em;
  color: #b89b7a;
  transition: color 0.18s;
}
.price-sort-btn.active, .price-sort-btn:active, .price-sort-btn:focus {
  background: linear-gradient(90deg,#cdb5a7 0,#b89b7a 100%);
  color: #fff;
  box-shadow: 0 6px 24px 0 rgba(200,180,140,0.18);
  transform: scale(0.97);
}
.price-sort-btn.active i, .price-sort-btn:active i, .price-sort-btn:focus i {
  color: #fff;
}
.price-sort-btn:focus-visible {
  outline: 2px solid #b89b7a;
  outline-offset: 2px;
}
.mobile-filters-sort {
  display: none;
}
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
@media (max-width: 900px) {
  .price-sort-section {
    display: none;
  }
  .mobile-filters-sort {
    display: block;
    margin-bottom: 0;
  }
}
</style> 
<template>
  <div v-if="loading" class="container text-center py-5">
    <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
  </div>
  <div v-else>
    <div class="container" v-if="product">
      <div class="row">
        <div class="col-md-6">
          <div class="Product-Images">
            <div id="carouselProductImages" class="carousel slide">
              <div class="carousel-indicators">
                <button v-for="(img, idx) in product.images" :key="idx" type="button" data-bs-target="#carouselProductImages" :data-bs-slide-to="idx" :class="{active: idx===0}" aria-current="idx===0 ? 'true' : undefined" :aria-label="`Slide ${idx+1}`"></button>
              </div>
              <div class="carousel-inner">
                <div v-for="(img, idx) in product.images" :key="img.image_id || idx" :class="['carousel-item', {active: idx===0}]">
                  <img :src="img.image_url" class="d-block w-100" :alt="product.good_name + ' купить в Бишкеке, Кыргызстан'">
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselProductImages" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselProductImages" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
        <div class="offset-xl-1 pt-4 col-xl-5 col-md-6">
          <div>
            <h1>{{ product.good_name }}</h1>
          </div>
          <div class="mt-5">
            <span class="fs-4">Артикул: <span class="fw-bold">{{ product.articul }}</span></span>
          </div>
          <div class="mt-5">
            <div class="product_price-block d-flex align-items-center gap-3 mt-2 mb-3">
              <span v-if="hasDiscount" class="discount-badge">
                <i class="bi bi-percent"></i>
                -{{ discountPercent }}%
              </span>
              <span class="new-price">{{ product.retail_price_with_discount }} <span class="currency">сом</span></span>
              <span v-if="hasDiscount" class="old-price">{{ product.retail_price }}</span>
            </div>
          </div>
          <div class="color-selector mt-5" v-if="colorOptions.length > 0">
            <h5>Другие цвета</h5>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="color in colorOptions"
                :key="color.color_id"
                class="color-option"
                :class="{active: color.color_id === selectedColorId}"
                @click="selectedColorId = color.color_id"
                style="cursor:pointer"
              >
                {{ color.color_name }}
              </span>
            </div>
          </div>
          <div class="size-selector mt-3" v-if="sizeOptions.length > 0">
            <h5>Другие размеры</h5>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="size in sizeOptions"
                :key="size.good_id"
                class="size-option"
                :class="{active: size.good_id === product.good_id}"
                @click="size.good_id !== product.good_id && switchProduct(size.good_id)"
                style="cursor:pointer"
              >{{ size.size }}р</span>
            </div>
          </div>
          <div class="mt-5">
            <div class="button_cart px-3 pb-3">
              <button class="btn add-to-cart-btn w-100" @click="addToCart(product.good_id)">
                <i class="bi bi-basket3"></i>
                В корзину
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="Product-Info mt-4">
        <table>
          <tr><th>Категория</th><td>{{ category?.category_name || '—' }}</td></tr>
          <tr><th>Бренд</th><td>{{ brand?.manufacturer_name || '—' }}</td></tr>
          <tr><th>Коллекция</th><td>{{ collection?.collection_name || '—' }}</td></tr>
          <tr><th>Сезон</th><td>{{ season?.season_name || '—' }}</td></tr>
          <tr><th>Пол</th><td>{{ sex?.sex_name || '—' }}</td></tr>
          <tr><th>Цвет</th><td>{{ colorName?.color_name || '—' }}</td></tr>
          <tr><th>Материал</th><td>{{ material?.material_name || '—' }}</td></tr>
          <tr><th>Размер</th><td>{{ product.product_size || '—' }}</td></tr>
          <tr><th>Описание</th><td>{{ product.description || '—' }}</td></tr>
          <tr><th>Наличие</th><td>{{ product.warehouse_quantity != null ? product.warehouse_quantity + ' шт' : '—' }}</td></tr>
        </table>
      </div>
    </div>
    <div v-else class="container text-center py-5">
      <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addToCart } from '@/utils'
const product = ref(null)
const similarProducts = ref([])
const route = useRoute()
const router = useRouter()
const PLACEHOLDER_IMAGE = 'https://placehold.co/500x500'
const loading = ref(true)
const detailsLoading = ref(true)
const similarLoading = ref(true)

const category = ref(null)
const brand = ref(null)
const collection = ref(null)
const season = ref(null)
const sex = ref(null)
const colorName = ref(null)
const material = ref(null)

const hasDiscount = computed(() => product.value && product.value.retail_price !== product.value.retail_price_with_discount)
const discountPercent = computed(() => hasDiscount.value ? Math.round(((product.value.retail_price - product.value.retail_price_with_discount) / product.value.retail_price) * 100) : 0)

// Выбранный цвет
const selectedColorId = ref(null)
watch(product, (val) => {
  if (val && val.color && val.color.color_id) {
    selectedColorId.value = val.color.color_id
  }
})

// Только уникальные цвета
const colorOptions = computed(() => {
  if (!product.value) return []
  const all = [product.value, ...(similarProducts.value || [])]
  const map = new Map()
  all.forEach(p => {
    if (p.color && p.color.color_id) {
      map.set(p.color.color_id, {
        color_id: p.color.color_id,
        color_name: p.color.color_name,
        hex: p.color.hex_code
      })
    }
  })
  return Array.from(map.values())
})

// Только размеры для выбранного цвета
const sizeOptions = computed(() => {
  if (!product.value) return []
  const all = [product.value, ...(similarProducts.value || [])]
  return all
    .filter(p => p.color && p.color.color_id === selectedColorId.value)
    .map(p => ({
      size: p.product_size,
      good_id: p.good_id
    }))
    .sort((a, b) => Number(a.size) - Number(b.size))
})

function switchProduct(good_id) {
  if (good_id && good_id !== product.value.good_id) {
    window.scrollTo(0,0)
    router.push({query: {...route.query, good_id}})
  }
}

onMounted(() => { document.title = 'Товар | Nursace' })
onMounted(fetchProduct)
watch(() => route.query.good_id, fetchProduct)
watch(product, (val) => {
  if (val && val.good_name) {
    document.title = `${val.good_name} — купить в Бишкеке | Магазин обуви Nursace`;
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.setAttribute('name', 'description');
      document.head.appendChild(desc);
    }
    desc.setAttribute('content', `Купить ${val.good_name} в Бишкеке. Оригинальная обувь, доставка по Кыргызстану. Магазин Nursace.`);
  }
}, { immediate: true });

async function fetchDetails() {
  detailsLoading.value = true
  try {
    const promises = []
    if (product.value.category_id) promises.push((async () => { const r = await fetch(`${window.AppConfig.siteUrl}/categories/${product.value.category_id}`); category.value = await r.json() })())
    if (product.value.manufacturer_id) promises.push((async () => { const r = await fetch(`${window.AppConfig.siteUrl}/manufacturers/${product.value.manufacturer_id}`); brand.value = await r.json() })())
    if (product.value.collection_id) promises.push((async () => { const r = await fetch(`${window.AppConfig.siteUrl}/collections/${product.value.collection_id}`); collection.value = await r.json() })())
    if (product.value.season_id) promises.push((async () => { const r = await fetch(`${window.AppConfig.siteUrl}/seasons/${product.value.season_id}`); season.value = await r.json() })())
    if (product.value.sex_id) promises.push((async () => { const r = await fetch(`${window.AppConfig.siteUrl}/sexes/${product.value.sex_id}`); sex.value = await r.json() })())
    if (product.value.color && product.value.color.color_id) {
      promises.push((async () => { const r = await fetch(`${window.AppConfig.siteUrl}/colors/${product.value.color.color_id}`); colorName.value = await r.json() })())
    } else if (product.value.color_id) {
      promises.push((async () => { const r = await fetch(`${window.AppConfig.siteUrl}/colors/${product.value.color_id}`); colorName.value = await r.json() })())
    } else {
      colorName.value = null
    }
    if (product.value.material_id) promises.push((async () => { const r = await fetch(`${window.AppConfig.siteUrl}/materials/${product.value.material_id}`); material.value = await r.json() })())
    await Promise.all(promises)
  } finally {
    detailsLoading.value = false
  }
}

async function fetchSimilar() {
  similarLoading.value = true
  try {
    const simRes = await fetch(`${window.AppConfig.siteUrl}/products/${product.value.good_id}/similar`)
    similarProducts.value = await simRes.json()
  } catch (e) {
    similarProducts.value = []
  } finally {
    similarLoading.value = false
  }
}

async function fetchProduct() {
  loading.value = true
  detailsLoading.value = true
  similarLoading.value = true
  try {
    const good_id = route.query.good_id
    if (!good_id) return
    const url = `${window.AppConfig.siteUrl}/products/${good_id}`
    const res = await fetch(url)
    product.value = await res.json()
    if (product.value && product.value.good_name) {
      document.title = product.value.good_name + ' | Nursace'
    }
    if (!product.value.images || !product.value.images.length) {
      product.value.images = [{ image_url: PLACEHOLDER_IMAGE }]
    }
    // Параллельно подгружаем детали и похожие товары
    fetchDetails()
    fetchSimilar()
  } catch (e) {
    product.value = null
    similarProducts.value = []
    category.value = null
    brand.value = null
    collection.value = null
    season.value = null
    sex.value = null
    colorName.value = null
    material.value = null
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e");
}
.carousel-control-next-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
}
.carousel-indicators [data-bs-target] {
  background-color: #000 !important;
}
.carousel-indicators .active {
  background-color: #000 !important;
  opacity: 1 !important;
}
.carousel-item img {
  border-radius: 16px;
}
.Product-Info table {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}
.Product-Info th, .Product-Info td {
  padding: 8px;
  text-align: left;
  vertical-align: top;
}
.Product-Info th {
  font-weight: bold;
  width: 30%;
}
.color-option, .size-option {
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.color-option:hover, .size-option:hover {
  background-color: #f0f0f0;
}
.color-option.active, .size-option.active {
  border-color: #cdb5a7;
  background-color: #cdb5a7;
  color: #fff;
  font-weight: bold;
  transition: background 0.18s, color 0.18s, border-color 0.18s;
}
.add-to-cart-btn {
  background: linear-gradient(90deg,#cdb5a7 0,#b89b7a 100%) !important;
  color: #fff !important;
  border: none;
  border-radius: 2rem;
  font-size: 1.18rem;
  font-weight: 600;
  min-width: 180px;
  min-height: 48px;
  box-shadow: 0 4px 18px 0 rgba(200,180,140,0.13);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.18s, background 0.18s, color 0.18s, transform 0.12s;
  cursor: pointer;
  outline: none;
  gap: 12px;
}
.add-to-cart-btn:hover, .add-to-cart-btn:active, .add-to-cart-btn:focus {
  background: linear-gradient(90deg,#b89b7a 0,#cdb5a7 100%) !important;
  color: #fff !important;
  box-shadow: 0 8px 32px 0 rgba(200,180,140,0.22);
  transform: scale(0.97);
}
.add-to-cart-btn:focus-visible {
  outline: 2px solid #b89b7a;
  outline-offset: 2px;
}
.add-to-cart-btn i {
  font-size: 1.3em;
  margin-right: 0;
  vertical-align: middle;
  display: flex;
  align-items: center;
}
.product_price-block {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
}
.discount-badge {
  background: linear-gradient(90deg,#cdb5a7 0,#b89b7a 100%);
  color: #fff;
  font-size: 1.08rem;
  font-weight: 700;
  border-radius: 12px;
  padding: 6px 14px 6px 10px;
  box-shadow: 0 2px 8px rgba(200,180,140,0.08);
  display: flex;
  align-items: center;
  gap: 4px;
}
.new-price {
  color: #40474f;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}
.old-price {
  color: #b89b7a;
  font-size: 1.15rem;
  text-decoration: line-through;
  opacity: 0.7;
  margin-left: 6px;
  align-self: flex-end;
}
.currency {
  font-size: 1.1rem;
  font-weight: 500;
  margin-left: 2px;
}
</style> 
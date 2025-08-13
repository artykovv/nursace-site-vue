<template>
  <div class="container">
    <div class="mt-5">
      <div v-if="discounts.length" class="d-flex justify-content-between mb-2">
        <div>
          <a href="/category?discounts=true" class="products-all-btn">
            <i class="bi bi-fire" style="color:#ff5722;"></i>
            <span>Скидки</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
      <CarouselBlock v-if="discounts.length" :products="discounts" />
      
      <div v-if="products1.length" class="d-flex justify-content-between mb-2 mt-4">
        <div>
          <a :href="categoryLink(shoesCategoryId)" class="products-all-btn">
            <!-- <i class="bi bi-bag"></i> -->
            <span>Обувь</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
      <CarouselBlock v-if="products1.length" :products="products1" />
      <div v-if="products2.length" class="d-flex justify-content-between mb-2 mt-4">
        <div>
          <a :href="categoryLink(accessoriesCategoryId)" class="products-all-btn">
            <!-- <i class="bi bi-gem"></i> -->
            <span>Аксессуары</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
      <CarouselBlock v-if="products2.length" :products="products2" />
      <div v-if="products3.length" class="d-flex justify-content-between mb-2 mt-4">
        <div>
          <a :href="categoryLink(clothesCategoryId)" class="products-all-btn">
            <!-- <i class="bi bi-person-bounding-box"></i> -->
            <span>Одежда</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
      <CarouselBlock v-if="products3.length" :products="products3" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CarouselBlock from './CarouselBlock.vue'

const discounts = ref([])
const products1 = ref([])
const products2 = ref([])
const products3 = ref([])

const shoesCategoryId = ref(null)
const accessoriesCategoryId = ref(null)
const clothesCategoryId = ref(null)

function categoryLink(id) {
  return id ? `/category?category_id=${id}` : '/category'
}

onMounted(async () => {
  const url = window.AppConfig?.siteUrl 
  try {
    const [catsRes, discountsRes] = await Promise.all([
      fetch(`${url}/categories/v3/`),
      fetch(`${url}/products/v3/?discounts=true&offset=0&limit=10`)
    ])
    const categories = await catsRes.json()
    discounts.value = await discountsRes.json()

    const findId = (name) => categories.find(c => c.category_name === name)?.category_id || null
    shoesCategoryId.value = findId('Обувь')
    accessoriesCategoryId.value = findId('Аксессуары')
    clothesCategoryId.value = findId('Одежда')

    const [res1, res2, res3] = await Promise.all([
      shoesCategoryId.value ? fetch(`${url}/products/v3/?category_id=${shoesCategoryId.value}&offset=0&limit=10`) : Promise.resolve(null),
      accessoriesCategoryId.value ? fetch(`${url}/products/v3/?category_id=${accessoriesCategoryId.value}&offset=0&limit=10`) : Promise.resolve(null),
      clothesCategoryId.value ? fetch(`${url}/products/v3/?category_id=${clothesCategoryId.value}&offset=0&limit=10`) : Promise.resolve(null)
    ])

    products1.value = res1 ? await res1.json() : []
    products2.value = res2 ? await res2.json() : []
    products3.value = res3 ? await res3.json() : []
  } catch (e) {
    discounts.value = []
    products1.value = []
    products2.value = []
    products3.value = []
  }
})
</script>

<style scoped>
.carousel_container {
    position: relative;
    overflow: hidden;
    padding: 0px !important;
}
.products_container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    padding-bottom: 16px;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
}
.products_container::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
}
.product_card {
    scroll-snap-align: start;
    border-radius: 24px;
    width: 185px;
    background: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    min-width: 185px;
    max-width: 185px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    flex: 0 0 auto;
}
.product_name span {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 16px;
}
.product_card a {
    text-decoration: none;
    color: #40474f;
}
.product_image {
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border: 2px solid #cdb5a7;
    border-radius: 24px;
    position: relative;
}
.product_image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
    transition: transform 0.3s ease;
}
.product_image img:hover {
    transform: scale(1.05);
}
.discount_badge {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background-color: #cdb5a7;
    color: white;
    font-size: 0.8rem;
    padding: 4px 8px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 2;
}
.product_price {
    width: 100%;
    font-size: 1rem;
}
.old_price {
    text-decoration: line-through;
    color: #888;
}
.new_price {
    font-weight: bold;
    color: #000;
}
.button_cart {
    width: 100%;
}
.button_cart button,
.carousel-add-to-cart-btn {
  width: 100%;
  background: linear-gradient(90deg, #cdb5a7 0px, #b89b7a 100%) !important;
  border-radius: 2rem;
  padding: 7px 0;
  font-weight: 600;
  color: #fff !important;
  font-size: 0.98rem;
  border: none;
  box-shadow: 0 4px 18px 0 rgba(200,180,140,0.13);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: box-shadow 0.18s, background 0.18s, color 0.18s, transform 0.12s;
  cursor: pointer;
  outline: none;
}
.carousel-add-to-cart-btn i {
  font-size: 1.08em;
}
.carousel-add-to-cart-btn:hover, .carousel-add-to-cart-btn:active, .carousel-add-to-cart-btn:focus {
  background: linear-gradient(90deg,#b89b7a 0,#cdb5a7 100%) !important;
  color: #fff !important;
  box-shadow: 0 8px 32px 0 rgba(200,180,140,0.22);
  transform: scale(0.97);
}
.carousel-add-to-cart-btn:focus-visible {
  outline: 2px solid #b89b7a;
  outline-offset: 2px;
}
.carousel_btn {
    position: absolute !important;
    top: 40%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 25px 0 rgba(0,0,0,.05);
    color: #40474f;
    border: none;
    padding: 0;
    border-radius: 50%;
    cursor: pointer;
    z-index: 3;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.carousel_btn svg {
  width: 24px;
  height: 24px;
  display: block;
  margin: 0;
}
.carousel_btn_prev {
    left: 10px;
}
.carousel_btn_next {
    right: 10px;
}
.carousel_btn:hover {
    background: rgba(202, 202, 202, 0.7);
}
.products-all-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 16px;
  font-size: 1.13rem;
  font-weight: 500;
  color: #40474f;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border: 1px solid #ececec;
  transition: background 0.18s, box-shadow 0.18s, color 0.18s;
  text-decoration: none;
  padding: 10px 18px;
  margin-left: 0;
  justify-content: flex-start;
}
.products-all-btn i {
  font-size: 1.35rem;
  color: #b89b7a;
}
.products-all-btn svg {
  margin-left: 4px;
  color: #b89b7a;
}
.products-all-btn:hover, .products-all-btn:active {
  background: #ece6df;
  color: #b89b7a;
  box-shadow: 0 4px 16px rgba(200,180,140,0.08);
}
@media (max-width: 576px) {
    .product_card {
        width: 155px;
        min-width: 155px;
        max-width: 155px;
    }
    .product_name span {
        font-size: 12px;
    }
    .carousel_container {
        padding: 0px !important;
    }
    .carousel_btn {
        display: none !important;
    }
    .card-body h6 {
        font-size: 14px;
    }
    #search-input {
        background-color: rgb(230, 231, 234);
        border-radius: 16px;
    }
    .products-all-btn {
      width: 100%;
      display: flex;
    }
    .products-all-btn i {
      font-size: 1.1rem;
    }
    .products-all-btn svg {
      width: 20px;
      height: 20px;
    }
}
</style> 
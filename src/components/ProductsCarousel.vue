<template>
  <div class="container">
    <div class="mt-5">
      <div class="d-flex justify-content-between">

        <div>
          <a href="/category/" class="products-all-btn">
            <i class="bi bi-star"></i>
            <span>Популярные товары</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
      <div class="carousel_container position-relative p-3 mt-5">
        <div ref="productsContainer" class="products_container d-flex flex-row flex-nowrap gap-3">
          <div v-for="product in products" :key="product.good_id" class="product_card">
            <a :href="`/product?good_id=${product.good_id}`">
              <div class="product_image position-relative">
                <img :src="mainImage(product)" :alt="product.good_name">
                <div v-if="hasDiscount(product)" class="discount_badge">-{{ discountPercentage(product) }}% </div>
              </div>
              <div class="product_price d-flex px-3 py-2">
                <span class="old_price" :style="hasDiscount(product) ? '' : 'visibility: hidden;'">{{ product.retail_price }}</span>
                <span class="new_price ms-1">{{ product.retail_price_with_discount }} сом</span>
              </div>
              <div class="product_name p-3">
                <div>
                  <span>{{ product.good_name }}</span>
                </div>
              </div>
            </a>
            <div class="button_cart px-3 pb-3">
              <button class="btn carousel-add-to-cart-btn d-flex align-items-center justify-content-center" @click="addToCart(product.good_id)">
                <i class="bi bi-basket3"></i>
                <span>В корзину</span>
              </button>
            </div>
          </div>
        </div>
        <button class="carousel_btn carousel_btn_prev position-absolute" @click="moveCarousel(-1)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button class="carousel_btn carousel_btn_next position-absolute" @click="moveCarousel(1)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { addToCart } from '@/utils'

const products = ref([])
const productsContainer = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`${window.AppConfig.siteUrl}/products/v1/`)
    products.value = await res.json()
  } catch (error) {
    console.error('Error fetching products:', error)
  }
})

function mainImage(product) {
  const img = product.images?.find(img => img.is_main)
  return img ? img.image_url : 'https://placehold.co/500x500'
}
function hasDiscount(product) {
  return product.retail_price !== product.retail_price_with_discount
}
function discountPercentage(product) {
  if (!hasDiscount(product)) return 0
  return Math.round(((product.retail_price - product.retail_price_with_discount) / product.retail_price) * 100)
}
function moveCarousel(direction) {
  const container = productsContainer.value
  if (!container) return
  const card = container.querySelector('.product_card')
  if (!card) return
  const scrollAmount = card.offsetWidth + 16
  container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
}
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
  display: inline-flex;
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
  margin-left: 10px;
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
      font-size: 1rem;
      padding: 8px 12px;
      margin-left: 4px;
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
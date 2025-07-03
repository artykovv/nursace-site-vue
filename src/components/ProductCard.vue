<template>
  <div class="product-card shadow-sm rounded-4 h-100 d-flex flex-column">
    <router-link
      :to="{ path: '/product', query: { good_id: product.good_id } }"
      class="product-card-img-link"
      tabindex="0"
      aria-label="Перейти к товару {{ product.good_name }}"
    >
      <div class="product-card-image position-relative rounded-4 overflow-hidden">
        <img :src="mainImage" :alt="product.good_name" class="w-100 h-100 object-fit-cover" loading="lazy" />
        <span v-if="hasDiscount" class="discount-badge d-flex align-items-center gap-1">
          <i class="bi bi-percent"></i>
          -{{ discountPercentage }}%
        </span>
      </div>
    </router-link>
    <div class="product-card-body flex-grow-1 d-flex flex-column justify-content-between p-3">
      <router-link
        :to="{ path: '/product', query: { good_id: product.good_id } }"
        class="product-card-title-link"
        tabindex="0"
        aria-label="Перейти к товару {{ product.good_name }}"
      >
        <div class="product-card-title fw-semibold mb-2 text-start">{{ product.good_name }}</div>
      </router-link>
      <div class="product-card-prices d-flex align-items-start justify-content-start gap-2 mb-3">
        <span class="new-price fw-bold">{{ product.retail_price_with_discount }} сом</span>
        <span v-if="hasDiscount" class="old-price text-decoration-line-through text-muted">{{ product.retail_price }}</span>
      </div>
      <button
        class="btn btn-primary product-card-cart-btn d-flex align-items-center justify-content-center gap-2 w-100 mt-auto"
        type="button"
        @click="addToCart(product.good_id)"
        aria-label="Добавить в корзину"
      >
        <i class="bi bi-basket3"></i>
        <span>В корзину</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { addToCart } from '@/utils'
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
const mainImage = computed(() => {
  const img = props.product.images?.find(img => img.is_main)
  return img ? img.image_url : 'https://placehold.co/500x500'
})
const hasDiscount = computed(() => props.product.retail_price !== props.product.retail_price_with_discount)
const discountPercentage = computed(() => {
  if (!hasDiscount.value) return 0
  return Math.round(((props.product.retail_price - props.product.retail_price_with_discount) / props.product.retail_price) * 100)
})
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  transition: box-shadow 0.18s, transform 0.18s;
  min-width: 0;
  min-height: 100%;
  overflow: hidden;
  position: relative;
}
.product-card:hover {
  box-shadow: 0 6px 24px rgba(200,180,140,0.13);
  transform: translateY(-2px) scale(1.01);
}
.product-card-img-link {
  display: block;
  border-radius: 1.25rem 1.25rem 0 0;
  overflow: hidden;
}
.product-card-image {
  width: 100%;
  aspect-ratio: 1/1;
  background: #f8f8f8;
  position: relative;
  min-height: 180px;
  max-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.18s;
}
.product-card:hover .product-card-image img {
  transform: scale(1.04);
}
.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(90deg,#cdb5a7 0,#b89b7a 100%);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 6px 14px 6px 10px;
  box-shadow: 0 2px 8px rgba(200,180,140,0.08);
  z-index: 2;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.product-card-title-link {
  color: #40474f;
  text-decoration: none;
  transition: color 0.18s;
}
.product-card-title-link:hover {
  color: #b89b7a;
}
.product-card-title {
  font-size: 1.08rem;
  font-weight: 600;
  min-height: 2.5em;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 2.6em;
}
.product-card-prices {
  font-size: 1.1rem;
  align-items: flex-end;
}
.old-price {
  color: #b89b7a;
  font-size: 0.93rem;
  text-decoration: line-through;
  opacity: 0.7;
  margin-right: 2px;
  align-self: flex-end;
}
.new-price {
  color: #40474f;
  font-size: 1.18rem;
  font-weight: 700;
}
.product-card-cart-btn {
  border-radius: 2rem;
  font-size: 1.18rem;
  font-weight: 600;
  padding: 12px 0;
  min-width: 100%;
  min-height: 48px;
  box-shadow: 0 4px 18px 0 rgba(200,180,140,0.13);
  background: linear-gradient(90deg,#cdb5a7 0,#b89b7a 100%) !important;
  border: none;
  color: #fff !important;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  transition: box-shadow 0.18s, background 0.18s, color 0.18s, transform 0.12s;
  cursor: pointer;
  outline: none;
}
.product-card-cart-btn:hover, .product-card-cart-btn:active, .product-card-cart-btn:focus {
  background: linear-gradient(90deg,#b89b7a 0,#cdb5a7 100%) !important;
  color: #fff !important;
  box-shadow: 0 8px 32px 0 rgba(200,180,140,0.22);
  transform: scale(0.97);
}
.product-card-cart-btn:focus-visible {
  outline: 2px solid #b89b7a;
  outline-offset: 2px;
}
@media (max-width: 576px) {
  .product-card {
    border-radius: 1rem;
    min-height: 100%;
  }
  .product-card-image {
    min-height: 120px;
    max-height: 180px;
  }
  .product-card-title {
    font-size: 0.93rem;
    min-height: 2.2em;
    max-height: 2.3em;
  }
  .new-price {
    font-size: 1.01rem;
  }
  .product-card-cart-btn {
    font-size: 1rem;
    padding: 10px 0;
  }
  .discount-badge {
    font-size: 0.95rem;
    padding: 5px 10px 5px 8px;
  }
  .old-price {
    font-size: 0.78rem;
  }
}
</style> 
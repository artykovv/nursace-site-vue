<template>
  <div class="footer container p-4">
    <hr>
    <router-link to="/" aria-label="Bootstrap">
      <img src="https://static.ticimax.cloud/5448/uploads/editorUploads/nurasce-web-logo-02.png" alt="Logo" class="img-fluid" style="max-height: 60px;">
    </router-link>
    <div class="footer-logo-row d-flex align-items-center justify-content-start mt-5 mb-3">
      <div class="footer-payment-logos ms-3">
        <img src="https://cdn.freedompay.kg/ppv2/img/visa.svg" alt="Visa" class="payment-logo" />
        <img src="https://cdn.freedompay.kg/ppv2/img/mastercard.svg" alt="Mastercard" class="payment-logo" />
        <img src="https://cdn.freedompay.kg/ppv2/img/elkart.svg" alt="Elkart" class="payment-logo" />
      </div>
    </div>

    <div class="footer-info">
      <div class="footer-menu mt-5">
        <div class="d-flex justify-content-between flex-wrap">
          <div>
            <span class="btn w-100 d-flex justify-content-between align-items-center">
              <h5 class="fs4">Меню</h5>
            </span>
            <router-link to="/" class="footer-btn">
              <i class="bi bi-house"></i>
              <span>Главная</span>
            </router-link>
            <router-link to="/categories" class="footer-btn">
              <i class="bi bi-grid"></i>
              <span>Каталог</span>
            </router-link>
            <router-link to="/cart" class="footer-btn">
              <i class="bi bi-basket3"></i>
              <span>Корзина</span>
            </router-link>
            <router-link to="/profile" class="footer-btn">
              <i class="bi bi-person-circle"></i>
              <span>Личный кабинет</span>
            </router-link>
          </div>
          <div>
            <span class="btn w-100 d-flex justify-content-between align-items-center">
              <h5 class="fs4">Вопросы</h5>
            </span>
            <a href="/docs/support/" class="footer-btn">
              <i class="bi bi-question-circle"></i>
              <span>Поддержка</span>
            </a>
            <a href="/docs/support/" class="footer-btn">
              <i class="bi bi-arrow-counterclockwise"></i>
              <span>Возврат товара</span>
            </a>
          </div>
          <div>
            <span class="btn w-100 d-flex justify-content-between align-items-center">
              <h5 class="fs4">Мы в социальных сетях</h5>
            </span>
            <a href="/" class="footer-btn">
              <i class="bi bi-instagram"></i>
              <span>Instagram</span>
            </a>
          </div>
          <div>
            <span class="btn w-100 d-flex justify-content-between align-items-center">
              <h5 class="fs4">Документы</h5>
            </span>
            <a href="/docs/userAgreement" class="footer-btn">
              <i class="bi bi-file-earmark-text"></i>
              <span>Пользовательское соглашение</span>
            </a>
            <a href="/docs/privacyPolicy" class="footer-btn">
              <i class="bi bi-shield-lock"></i>
              <span>Политика конфиденциальности</span>
            </a>
          </div>
          <div>
            <span class="btn w-100 d-flex justify-content-between align-items-center">
              <h5 class="fs4">Информация</h5>
            </span>
            <div class="footer-info-horizontal">
              <a href="/docs/sposoby-oplaty" class="footer-btn">
                <i class="bi bi-credit-card"></i>
                <span>Способы оплаты</span>
              </a>
              <a href="/docs/o-nas" class="footer-btn">
                <i class="bi bi-info-circle"></i>
                <span>О нас</span>
              </a>
              <a href="/docs/politika-vozvrata-tovarov" class="footer-btn">
                <i class="bi bi-arrow-counterclockwise"></i>
                <span>Политика возврата товаров</span>
              </a>
              <a href="/docs/pravila-vozvrata-denezhnyh-sredstv" class="footer-btn">
                <i class="bi bi-cash-coin"></i>
                <span>Правила возврата денежных средств</span>
              </a>
              <a href="/docs/kontakty" class="footer-btn">
                <i class="bi bi-telephone"></i>
                <span>Контакты</span>
              </a>
            </div>
          </div>
        </div>
        <div class="mt-5">
          <span class="btn w-100 d-flex justify-content-between align-items-center">
            <h5 class="fs4">Поддержка по вашим заказам</h5>
          </span>
          <p class="btn w-100 d-flex justify-content-between align-items-center">с 09:00 до 21:00</p>
        </div>
      </div>
    </div>
  </div>
  <div class="mobile-footer2"></div>
</template>

<script setup>
// Нет логики, только разметка
</script>

<style scoped>
.footer-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 16px;
  font-size: 1.13rem;
  font-weight: 500;
  color: #40474f;
  transition: background 0.18s, box-shadow 0.18s, color 0.18s;
  text-decoration: none;
  padding: 10px 18px;
  margin-bottom: 10px;
}
.footer-btn i {
  font-size: 1.35rem;
  color: #b89b7a;
}
.footer-btn:hover, .footer-btn:active {
  background: #ece6df;
  color: #b89b7a;
  box-shadow: 0 4px 16px rgba(200,180,140,0.08);
}
.footer-info-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}
.footer-info-horizontal .footer-btn {
  margin-bottom: 0;
}
.footer-payment-logos {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 0;
}
.footer-logo-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}
.payment-logo {
  height: 32px;
  width: auto;
  display: block;
}
@media (max-width: 576px) {
  .footer {
    display: none !important;
  }
  .mobile-footer2 {
    margin-top: 100px;
  }
  .footer-btn {
    font-size: 1rem;
    padding: 8px 12px;
  }
  .footer-btn i {
    font-size: 1.1rem;
  }
  .footer-info-horizontal {
    flex-direction: column;
    gap: 0;
  }
  .footer-logo-row {
    flex-direction: column;
    gap: 8px;
  }
  .footer-payment-logos {
    justify-content: center;
    gap: 10px;
  }
  .payment-logo {
    height: 24px;
  }
}
</style> 
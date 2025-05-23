<template>
  <div class="container pb-32" v-if="!loadingStore.isLoading">
    <span class="row border-bottom border-2 my-2 py-2">
      <div class="col-12 col-lg-10">
        <div class="row flex-row-reverse flex-md-row align-items-center justify-content-start">
          <div class="col-2 col-md-1 px-0">
            <button
              type="button"
              class="btn border border-1 d-inline reset-btn ms-2 ms-lg-0 me-lg-2"
              title="重置選擇"
              @click="handleResetCategory"
            >
              <font-awesome-icon :icon="['fas', 'rotate']" class="" />
            </button>
          </div>
          <!--種類相關-->
          <div class="col-4 col-md-3 ps-0 pe-lg-0">
            <select
              class="products-select-rwd form-select d-inline ms-2 ms-lg-0 me-lg-2"
              aria-label="Default select example"
              v-model="categoryStore.categoryTarget"
            >
              <option value="" selected disabled>請選擇主類型</option>
              <option :value="category.text" v-for="category in categoryList" :key="category.id">
                <span v-if="category.text === '特價中'">全部商品(特價)</span>
                <span v-else>
                  {{ category.text }}
                </span>
              </option>
            </select>
          </div>
          <!--排序相關-->
          <div class="col-6 col-md-4 pe-1 pe-md-0">
            <select
              class="products-select-rwd form-select d-inline ms-lg-0"
              aria-label="Default select example"
              v-model="targetSort"
            >
              <option
                :value="sort.command"
                v-for="sort in sortList"
                :key="sort.id"
                :selected="sort.command === 'create_date'"
              >
                {{ sort.title }}
              </option>
            </select>
          </div>
          <div class="col-12 col-md-4 ps-1 ps-lg-12 mt-2 mt-md-0" v-if="searchStore.isSearch">
            <button
              type="button"
              class="btn btn-warning border border-1 d-inline reset-btn ms-2 ms-lg-0 me-lg-2"
              title="重置關鍵字搜尋"
              @click="handleResetCategory"
              v-if="searchStore.isSearch"
            >
              重置關鍵字搜尋
            </button>
          </div>
        </div>
      </div>
    </span>
    <div class="row mt-4" v-if="newSortProducts.length !== 0">
      <div
        class="col-sm-6 col-md-4 col-lg-3 mb-3"
        v-for="product in newSortProducts"
        :key="product.id"
      >
        <HomeCard :product="product" :imgClass="'products-card-img'" />
      </div>
    </div>

    <div v-else class="pt-3">
      <p>
        <font-awesome-icon
          :icon="['fas', 'circle-exclamation']"
          class="text-danger me-2"
        />您輸入的關鍵字找不到相關商品，請嘗試其他關鍵字，或使用類別查看商品。謝謝
      </p>
    </div>

    <div class="flex-center mt-3 pt-3" v-if="!searchStore.isSearch">
      <PaginationComponent :pagination="ProductsPagination" @updated:page="fetchProducts" />
    </div>
  </div>

  <VueLoading :active="loadingStore.isLoading" :can-cancel="false" :color="'#0089A7'" />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import VueLoading from 'vue-loading-overlay';
import axios from 'axios';

import { useAlert } from '@/composables/useAlert';
import PaginationComponent from '@/components/common/PaginationComponent.vue';
import HomeCard from '@/components/common/HomeCard.vue';

// 計算屬性：為產品列表中的每個產品計算星星符號
import { calculateProductsRatings } from '@/composables/ratingUtils';
import useLoadingStore from '@/stores/loadingStores';
import useCategoryStore from '@/stores/categoryStores';
import useSearchStore from '@/stores/searchStores';

const categoryStore = useCategoryStore();
const loadingStore = useLoadingStore();
const searchStore = useSearchStore();

const { showAlert } = useAlert();

const productsList = ref([]);
const ProductsPagination = ref([]);
const targetCategory = ref('');
const targetSort = ref('default');

const baseApiUrl = import.meta.env.VITE_APP_BASE_API_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;

const fetchProducts = async (page = 1, category = '') => {
  try {
    loadingStore.toggleLoading(); // 全頁加載
    // 取得產品
    const api = `/products?page=${page}&category=${category}`;
    const response = await axios.get(api);
    productsList.value = response.data.products;
    ProductsPagination.value = response.data.pagination;
  } catch (error) {
    showAlert({
      title: '失敗',
      text: `${error.response.data.message}`,
      icon: 'error',
      confirmButtonText: '確認',
      confirmButtonColor: '#000000',
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
  } finally {
    loadingStore.toggleLoading();
  }
};

// 取得星星資訊
const productsRatings = computed(() => {
  const ratings = calculateProductsRatings(productsList.value);
  return ratings;
});

const categoryList = computed(() => [
  { id: '0', text: '全部商品' },
  { id: '1', text: '特價中' },
  { id: '2', text: '家具' },
  { id: '3', text: '家飾' },
  { id: '4', text: '燈具' },
  { id: '5', text: '廚房用品' },
  { id: '6', text: '浴室用品' },
  { id: '7', text: '寢具' },
  { id: '8', text: '收納' },
  { id: '9', text: '戶外與園藝' },
  { id: '10', text: '辦公室用品' },
  { id: '11', text: '孩童家居' },
]);

const sortList = ref([
  { id: 0, title: '排序：默認', command: 'default' },
  { id: 1, title: '排序：推薦', command: 'recommend' },
  { id: 2, title: '排序：特價', command: 'sale' },
  { id: 3, title: '排序：評價高到低', command: 'comments' },
  { id: 4, title: '排序：價格低到高', command: 'price_small' },
  { id: 5, title: '排序：價格高到低', command: 'price_big' },
  { id: 6, title: '排序：建立產品新到舊', command: 'create_date_new' },
  { id: 7, title: '排序：建立產品舊到新', command: 'create_date_old' },
]);

// 種類相關
onMounted(() => {
  // 當初次加載重新取得所有商品，防止換頁丟失資訊
  if (categoryStore.categoryTarget === '全部商品') {
    fetchProducts();
  } else if (categoryStore.categoryTarget === '特價中') {
    targetSort.value = 'sale';
    fetchProducts(1, '');
  } else {
    fetchProducts(1, categoryStore.categoryTarget);
  }
});

watch(
  () => categoryStore.categoryTarget,
  () => {
    if (categoryStore.categoryTarget === '全部商品') {
      targetSort.value = 'default';
      fetchProducts(1, '');
    } else if (categoryStore.categoryTarget === '特價中') {
      targetSort.value = 'sale';
      fetchProducts(1, '');
    } else {
      targetSort.value = 'default';
      fetchProducts(1, categoryStore.categoryTarget);
    }
  },
);

// 更新搜尋商品至當前
watch(
  () => searchStore.productsList,
  () => {
    const newArray = searchStore.productsList.map((proxyObj) => proxyObj.item);
    productsList.value = newArray;
  },
);

// 排序相關
const newSortProducts = computed(() => {
  let sortedProducts = productsRatings.value.slice();
  switch (targetSort.value) {
    case 'default':
      // 恢復預設值
      sortedProducts = productsRatings.value.slice();
      break;
    case 'recommend':
      // 推薦標籤+評價星級+數量
      sortedProducts.sort((a, b) => {
        // 首先根據是否推薦進行排序

        if (a.isRecommended && !b.isRecommended) {
          return -1;
        }
        if (!a.isRecommended && b.isRecommended) {
          return 1;
        }

        // 接著根據星級評價（假設是fullStars）降序排序
        const starDifference = b.starSymbols.fullStars - a.starSymbols.fullStars;
        if (starDifference !== 0) {
          return starDifference;
        }

        // 如果星級評價相同，則根據評論數量（假設是totalRatings）降序排序
        const ratingDifference = b.totalRatings - a.totalRatings;
        if (ratingDifference !== 0) {
          return ratingDifference;
        }

        // 最後，如果上述條件都相同，則根據創建日期降序排序
        return new Date(b.create_date) - new Date(a.create_date);
      });
      break;
    case 'comments':
      // 評價由高到低
      sortedProducts.sort((a, b) => {
        // 首先根據滿星數量進行降序排序
        const starDifference = b.starSymbols.fullStars - a.starSymbols.fullStars;
        if (starDifference !== 0) {
          return starDifference;
        }
        // 如果滿星數量相同，則根據評論數量進行降序排序
        return b.totalRatings - a.totalRatings;
      });
      break;
    case 'sale':
      sortedProducts.sort((a, b) => {
        if (a.isOnSale && !b.isOnSale) {
          return -1;
        }
        if (!a.isOnSale && b.isOnSale) {
          return 1;
        }
        return new Date(b.create_date) - new Date(a.create_date);
      });
      break;
    case 'price_small':
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price_big':
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case 'create_date_new':
      sortedProducts.sort((a, b) => new Date(b.create_date) - new Date(a.create_date));
      break;
    case 'create_date_old':
      // 假設推薦排序的邏輯（這裡只是一個示例，您需要根據實際情況來實現）
      sortedProducts.sort((a, b) => new Date(a.create_date) - new Date(b.create_date));
      break;
    default:
      break;
  }

  return sortedProducts;
});

// 重置類型選擇

const handleResetCategory = () => {
  categoryStore.categoryTarget = '全部商品';
  targetCategory.value = '';
  targetSort.value = 'default';
  searchStore.isSearch = false; // 清除搜尋狀態
  searchStore.searchText = '';
  fetchProducts();
};


</script>

<style lang="scss">
.products-card-img {
  display: block;
  object-fit: cover;
  width: 100%;
  height: auto;
  height: 300px;
}
</style>

<template>
  <section class="mt-32 mt-lg-80 pt-80">
    <h3 class="home-title mb-3">商品分類</h3>
    <div class="container mt-5">
      <div class="row justify-content-center align-items-start">
        <div class="col-4" v-if="!isMobile">
          <router-link
            to="/products"
            class="hover-img-opacity"
            @click="handleChangeCategory('特價中')"
          >
            <img
              :src="categorySale"
              class="category-sale-bg-img"
              alt="特價中"
            />
            <p class="fs-4 fw-500 text-dark text-center pt-2">特價中</p>
          </router-link>
        </div>
        <div class="col-lg-8">
          <div class="row justify-content-center align-items-center">
            <div class="col-6 col-sm-3" v-if="isMobile">
              <router-link
                to="/products"
                class="hover-img-opacity"
                @click="handleChangeCategory('特價中')"
              >
                <img
                  :src="categorySale"
                  class="category-sale-sm-img"
                  alt="特價中"
                />
                <p class="fs-4 fw-500 text-dark text-center pt-2">特價中</p>
              </router-link>
            </div>
            <div
              class="col-6 col-sm-3"
              v-for="(item, index) in categoryList"
              :key="item.title"
              :style="{ marginBottom: !isMobile ? '1.25rem' : '' }"
            >
              <!-- 當手機板時只顯示最多6個類型選擇 -->
              <div v-if="isPhone">
                <router-link
                  :to="item.path"
                  class="hover-img-opacity"
                  v-if="index <= 4"
                  @click="handleChangeCategory(item.title)"
                >
                  <img :src="item.imgUrl" :alt="item.title" class="category-img" />
                  <p class="fs-4 fw-500 text-dark text-center pt-2">{{ item.title }}</p>
                </router-link>
              </div>

              <div v-else-if="isMobile">
                <router-link
                  :to="item.path"
                  class="hover-img-opacity"
                  v-if="index <= 6"
                  @click="handleChangeCategory(item.title)"
                >
                  <img :src="item.imgUrl" :alt="item.title" class="category-img" />
                  <p class="fs-4 fw-500 text-dark text-center pt-2">{{ item.title }}</p>
                </router-link>
              </div>

              <router-link
                :to="item.path"
                class="hover-img-opacity"
                v-else
                @click="handleChangeCategory(item.title)"
              >
                <img :src="item.imgUrl" :alt="item.title" class="category-img" />
                <p class="fs-4 fw-500 text-dark text-center pt-2">{{ item.title }}</p>
              </router-link>
            </div>
          </div>
          <div class="col-12 text-center mt-3" v-if="isMobile">
            <router-link
              to="/products"
              class="btn btn-primary text-white py-2 px-3"
              @click="handleChangeCategory('全部商品')"
              >更多類型</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

import useCategoryStore from '@/stores/categoryStores';

import categorySale from '@/assets/images/home/category-特價.png';
import categoryAll from '@/assets/images/home/category-全部.png';
import categoryFurniture from '@/assets/images/home/category-家具.png';
import categoryHomeDecoration from '@/assets/images/home/category-家飾.png';
import categoryLighting from '@/assets/images/home/category-燈具.png';
import categoryKitchenSupplies from '@/assets/images/home/category-廚房用品.png';
import categoryBathroomSupplies from '@/assets/images/home/category-浴室用品.png';
import categoryBedding from '@/assets/images/home/category-寢具.png';
import categoryStorage from '@/assets/images/home/category-收納.png';


const screenWidth = ref(window.innerWidth);
const isMobile = ref(false);
const isPhone = ref(false);
const categoryStore = useCategoryStore();

const categoryList = [
  {
    title: '全部商品',
    path: '/products',
    imgUrl:
    categoryAll,
  },
  {
    title: '家具',
    path: '/products',
    imgUrl:
    categoryFurniture
  },
  {
    title: '家飾',
    path: '/products',
    imgUrl:
    categoryHomeDecoration
  },
  {
    title: '燈具',
    path: '/products',
    imgUrl:
    categoryLighting,
  },
  {
    title: '廚房用品',
    path: '/products',
    imgUrl:
    categoryKitchenSupplies
  },
  {
    title: '浴室用品',
    path: '/products',
    imgUrl:
    categoryBathroomSupplies
  },
  {
    title: '寢具',
    path: '/products',
    imgUrl:
    categoryBedding
  },
  {
    title: '收納',
    path: '/products',
    imgUrl:
    categoryStorage
  },
];

const handleChangeCategory = (target) => {
  categoryStore.categoryTarget = target;
};

// 監視螢幕寬度的變化
watchEffect(() => {
  const handleResize = () => {
    screenWidth.value = window.innerWidth;
  };

  if (screenWidth.value <= 992) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
  }

  if (screenWidth.value <= 375) {
    isPhone.value = true;
  } else {
    isPhone.value = false;
  }

  window.addEventListener('resize', handleResize);

  // 在組件被卸載時，移除 resize 事件的監聽器
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});
</script>

<style lang="scss">
.category-sale-sm-img {
  height: auto;
  object-fit: cover;

  @media (max-width: 1600px) {
    width: 156px;
    height: 156px;
  }
  @media (max-width: 992px) {
    width: 136px;
    height: 136px;
  }
  @media (max-width: 768px) {
    width: 156px;
    height: 156px;
  }
  @media (max-width: 576px) {
    width: 111px;
    height: 111px;
  }
  @media (max-width: 414px) {
    width: 164.5px;
    height: 164.5px;
  }
  @media (max-width: 375px) {
    width: 163.5px;
    height: 146px;
  }
}

.category-sale-bg-img {
  height: auto;
  object-fit: cover;

  @media (min-width: 992px) {
    width: 289px;
    height: 352px;
  }
  @media (min-width: 1200px) {
    width: 349px;
    height: 412px;
  }
  @media (min-width: 1400px) {
    width: 411px;
    height: 474px;
  }
}

.category-img {
  width: 100%;
  height: auto;
  object-fit: cover;

  @media (max-width: 500px) {
    width: 163.5px;
    height: 146px;
  }
  @media (max-width: 414px) {
    width: 164.5px;
    height: 164.5px;
  }
  @media (max-width: 375px) {
    width: 164px;
    height: 146px;
  }
}
</style>

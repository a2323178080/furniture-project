<template>
  <div class="mt-32 mt-lg-80 pt-80">
    <h3 class="home-title">最新活動</h3>
    <div class="container mt-64">
      <div class="row justify-content-between gx-0 px-1 px-sm-0 gx-lg-5">
        <div class="col-lg-6 mt-0 mb-12" v-for="item in bulletinList" :key="item.title">
          <div
            class="row flex-column flex-md-row justify-content-center align-items-center border border-2 border-primary bg-primary-sup-light h-100 px-0"
          >
            <div class="col-md-4 px-0">
              <div class="fs-4 fw-500 text-center text-primary-700 pt-3 pb-2 p-md-3">
                {{ item.title }}
              </div>
            </div>
            <div class="col-md-8 px-0">
              <div class="text-primary-900 px-3 pb-3 p-md-3">
                {{ item.center }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 季節區塊 -->
      <div class="row overflow-x-nowrap-414 overflow-x-nowrap-lg mt-64">
        <div class="col-md-6 col-1-2-event col-2-2" v-for="event in events" :key="event.id">
          <div class="row">
            <div class="col-lg-7 px-0 mb-32">
              <router-link :to="`/newEvents/${event.id}`" class="hover-opacity">
                <img :src="event.imageUrl" :alt="event.title" class="event-img" />
              </router-link>
            </div>
            <div class="col-lg-5 px-0">
              <div class="d-flex flex-column justify-content-center align-items-center h-100 w-100">
                <p class="fs-2 fw-700 mb-12">{{ event.title }}</p>
                <p class="fs-4 fw-500 mb-32">{{ event.subtitle }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import { useAlert } from '@/composables/useAlert';

const bulletinList = [
  {
    title: '防詐騙宣導',
    center:
      '請注意假冒ICEA的可疑電話， 撇公司不會詢問信用卡或任何卡片資訊， 或指示顧客進行任何網路銀行或ATM操作。',
  },
  {
    title: '重要公告',
    center: '即日起至特定日期，全站優惠活動展開！折扣商品任你挑選，快來選購吧！',
  },
];

const { showAlert } = useAlert();
const eventLoading = ref(false);
const events = ref([]);
const fetchArticles = async () => {
  try {
    eventLoading.value = true;
    // 取得活動
    const api = `/events`;
    const response = await axios.get(api);
    events.value = response.data.events.filter((item) => item.isPublic);
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
    eventLoading.value = false;
  }
};

onMounted(() => {
  fetchArticles();
});
</script>

<style lang="scss">
.event-img {
  object-fit: contain;
  width: 380px;
  height: 288px;

  @media (max-width: 1200px) {
    width: 323px;
    height: 225px;
  }
  @media (max-width: 992px) {
    width: 258px;
    height: 199px;
  }
  @media (max-width: 768px) {
    width: 258px;
    height: 199px;
  }
  @media (max-width: 576px) {
    width: 188px;
    height: 143px;
  }
  @media (max-width: 414px) {
    width: 300px;
    height: 199px;
  }
}
</style>

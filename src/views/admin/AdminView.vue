<template>
  <header>
    <nav class="navbar bg-dark">
      <div class="container-fluid bg-dark py-1">
        <a class="navbar-brand text-white ps-2">{{ t('admin.dashboardName') }}</a>
        <ul class="list-unstyled d-flex justify-content-center align-items-center m-0">
          <li class="me-2" v-if="adminStore.isLogin">
            <button
              type="button"
              class="btn btn-light bg-dark text-white"
              @click="handleAdminLogout"
            >
              管理者登出
            </button>
          </li>
          <li>
            <div class="dropdown me-4">
              <button
                class="btn btn-secondary dropdown-toggle bg-dark text-white"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                :aria-expanded="isOpen"
                :class="isOpen ? 'show' : ''"
                @click.stop="changeIsOpenState"
                ref="dropdownMenuButton"
              >
                {{ t('admin.select_language_text') }} |
                <span :class="`fi fi-${i18nStore.currentIcon}`"></span>
              </button>
              <ul
                class="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
                :class="isOpen ? 'show' : ''"
              >
                <li v-for="item in i18nStore.languageList" :key="item.code">
                  <a
                    class="dropdown-item"
                    @click.prevent="handleChangI18nFn(item.code, item.icon_code)"
                    ><span :class="`fi fi-${item.icon_code}`"></span>{{ item.text }}</a
                  >
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <VueLoading :active="adminIsLogin" :can-cancel="false" :color="'#d63031'" />
  <RouterView />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Dropdown } from 'bootstrap';
import VueLoading from 'vue-loading-overlay';
import Swal from 'sweetalert2';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

import useI18nStore from '@/stores/i18nStores';
import { useAlert } from '@/composables/useAlert';
import useAdminStore from '@/stores/adminStores';

const adminStore = useAdminStore();

const { showAlert } = useAlert();
const route = useRoute();
const router = useRouter();
const adminIsLogin = ref(false);

const i18nStore = useI18nStore();
const { i18nChangeLocale } = i18nStore;
const { t } = useI18n();

const isOpen = ref(false); // 控制下拉式開啟或關閉
const dropdownMenuButton = ref(null);
function changeIsOpenState() {
  isOpen.value = !isOpen.value;
}

const handleChangI18nFn = (code, iconCode) => {
  // 紀錄選擇語系與icon代碼，並且保存至 localStorage 中。
  i18nChangeLocale(code, iconCode);
  isOpen.value = false; // 確認之後要把開啟狀態關閉
};

const handleAdminLogout = async () => {
  document.cookie = 'hexToken=;';
  router.push('/admin');
};

onMounted(() => {
  // 初始化下拉菜單
  Dropdown.getOrCreateInstance(dropdownMenuButton.value);
});

onMounted(() => {
  if (route.path.includes('dashboard')) {
    adminStore.isLogin = true; // 防止重新整理後 pinia 狀態消失
  }
});

// 取出 Token
axios.interceptors.request.use(
  (config) => {
    // 從 document.cookie 中提取最新的 Token
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('hexToken='))
      ?.split('=')[1];

    if (token) {
      config.headers['Authorization'] = token; // 動態設置 Authorization
    } else {
      console.warn('Token 不存在或已過期');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


</script>

<style lang="scss">
.dropdown-item {
  cursor: pointer;
}
</style>

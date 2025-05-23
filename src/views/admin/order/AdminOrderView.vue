<template>
  <div class="pt-3">
    <div class="row">
      <span class="col-6">
        <h3 class="">訂單列表</h3>
      </span>
<!--      <span class="col-6">-->
<!--        <div class="float-end pe-3">-->
<!--          <button type="button" class="btn btn-outline-danger px-4" @click="deleteOrders()">-->
<!--            刪除所有訂單-->
<!--          </button>-->
<!--        </div>-->
<!--      </span>-->
    </div>
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr class="fw-500">
            <td>編碼</td>
            <td>購買用戶</td>
            <td>訂單金額(NT)</td>
            <td>付款狀態</td>
            <td>寄送狀態</td>
            <td>操作</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in adminOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order?.user?.email }}</td>
            <td>{{ usePriceToTw(order.total) }}</td>
            <td>
              <div
                v-if="order.is_paid && order.paid_date"
                class="flex-center flex-column align-items-start text-success"
              >
                <span>已付款</span>
                <span>{{ new Date(order.paid_date * 1000).toISOString().split('T')[0] }}</span>
              </div>
              <span v-else class="text-dark">未付款</span>
            </td>
            <td>
              <span v-if="order.status">
                <span
                  :class="`${
                    order.status === '0'
                      ? 'text-muted'
                      : order.status === '1'
                        ? 'text-dark'
                        : order.status === '2'
                          ? 'text-info'
                          : 'text-success'
                  }`"
                >
                  {{
                    order.status === '0'
                      ? '未確認'
                      : order.status === '1'
                        ? '已確認'
                        : order.status === '2'
                          ? '寄送中'
                          : '已送達'
                  }}
                </span>
              </span>
              <span v-else class="text-muted">未確認</span>
            </td>
            <td>
              <div class="d-flex align-items-center">
                <button
                  type="button"
                  class="btn btn-outline-dark me-1"
                  @click="handleOpenModal(order)"
                >
                  編輯
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  :disabled="deleteTarget === order.id"
                  @click="deleteOrder(order.id)"
                >
                  <span v-if="deleteTarget === order.id">
                    <span class="spinner-grow spinner-grow-sm me-1" aria-hidden="true"></span>
                    <span role="status"></span>
                    <span>刪除中</span>
                  </span>
                  <span v-else> 刪除 </span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <PaginationComponent :pagination="adminPagination" @updated:page="fetchOrders" />
    <AdminOrderModal ref="adminOrderModal" @refetch-orders="fetchOrders" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useLoadingStore from '@/stores/loadingStores';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

import { useAlert } from '@/composables/useAlert';
import PaginationComponent from '@/components/common/PaginationComponent.vue';
import AdminOrderModal from '@/components/admin/order/AdminOrderModal.vue';
import usePriceToTw from '@/composables/usePriceToTw';

const router = useRouter();
const { showAlert } = useAlert();
const loadingStore = useLoadingStore();

const adminOrderModal = ref(null);
const adminOrders = ref([]);
const adminPagination = ref([]);
const deleteTarget = ref('');

// 傳遞開啟方法與資料給 Modal 子元件
const handleOpenModal = (order) => {
  adminOrderModal.value.openModal(order);
};

const baseApiUrl = import.meta.env.VITE_APP_BASE_API_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;

const fetchOrders = async (page = 1) => {
  try {
    loadingStore.toggleLoading(); // 全頁加載
    // 取得後台訂單
    const api = `/admin/orders?page=${page}`;
    const response = await axios.get(api);
    adminOrders.value = response.data.orders.reverse();
    adminPagination.value = response.data.pagination;
  } catch (error) {
    showAlert({
      title: '失敗',
      text: `${error.response.data.message}`,
      icon: 'error',
      confirmButtonText: '確認',
      confirmButtonColor: '#000000',
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // 按下確認後回到管理者登入頁
        router.replace('/admin');
      }
    });
  } finally {
    loadingStore.toggleLoading();
  }
};

const deleteOrder = async (id) => {
  try {
    // 刪除後台訂單
    const api = `/admin/order/${id}`;
    showAlert({
      title: '確認刪除訂單?',
      text: '注意：確認刪除後，訂單將無法復原!',
      icon: 'question',
      confirmButtonColor: '#29292D',
      cancelButtonColor: '#b2bec3',
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      showCancelButton: true,
      showCloseButton: true,
      showLoaderOnConfirm: true,
      reverseButtons: true,
      preConfirm: async () => {
        try {
          deleteTarget.value = id;
          return await axios.delete(api);
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
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result?.value?.data?.success) {
        showAlert({
          position: 'top-start',
          title: `成功 | ${result?.value?.data?.message}`,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        setTimeout(() => {
          fetchOrders();
        }, 1000);
      }
    });
  } catch (error) {
    showAlert({
      title: '失敗',
      text: `${error.response.data.message}`,
      icon: 'error',
      confirmButtonText: '確認',
      confirmButtonColor: '#000000',
      allowEscapeKey: false,
    });
  } finally {
    deleteTarget.value = '';
  }
};

const deleteOrders = async () => {
  try {
    const api = `${baseApiUrl}/v2/api/${apiPath}/admin/orders/all`;
    showAlert({
      title: '確認刪除全部訂單?',
      text: '注意：確認刪除後，全部訂單將無法復原!',
      icon: 'question',
      confirmButtonColor: '#29292D',
      cancelButtonColor: '#b2bec3',
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      showCancelButton: true,
      showCloseButton: true,
      showLoaderOnConfirm: true,
      reverseButtons: true,
      preConfirm: async () => {
        try {
          return await axios.delete(api);
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
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result?.value?.data?.success) {
        showAlert({
          position: 'top-start',
          title: `成功 | ${result?.value?.data?.message}`,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        });
        setTimeout(() => {
          fetchOrders();
        }, 1000);
      }
    });
  } catch (error) {
    showAlert({
      title: '失敗',
      text: `${error.response.data.message}`,
      icon: 'error',
      confirmButtonText: '確認',
      confirmButtonColor: '#000000',
      allowEscapeKey: false,
    });
  }
};
onMounted(() => {
  fetchOrders();
});
</script>

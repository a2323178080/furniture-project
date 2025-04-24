<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: !pagination.has_pre }">
        <a
          class="page-link"
          href="#"
          @click.prevent="
            () => {
              changePage(pagination.current_page - 1, pagination.category);
              handleToTop();
            }
          "
          >&lt;</a
        >
      </li>
      <li class="page-item" v-for="page in pagination.total_pages" :key="page + 2123">
        <a
          class="page-link"
          href="#"
          @click.prevent="
            () => {
              changePage(page, pagination.category);
              handleToTop();
            }
          "
          :class="{ active: page === pagination.current_page }"
          >{{ page }}</a
        >
      </li>

      <li class="page-item" :class="{ disabled: !pagination.has_next }">
        <a
          class="page-link"
          href="#"
          @click.prevent="
            () => {
              changePage(pagination.current_page + 1, pagination.category);
              handleToTop();
            }
          "
          >></a
        >
      </li>
    </ul>
  </nav>
</template>

<script setup>
defineProps({
  pagination: Object,
  'get-products': Function,
});

const emit = defineEmits(['updated:page']);

const handleToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const changePage = (page, category) => {
  emit('updated:page', page, category);
};
</script>

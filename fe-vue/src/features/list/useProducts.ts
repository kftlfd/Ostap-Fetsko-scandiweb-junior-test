import { ref } from "vue";
import { deleteProductsByIds, getProductsList, ProductInfo } from "../../api";

const data = ref<ProductInfo[]>([]);

const initLoaded = ref(false);

const loading = ref(true);
const loadingError = ref<string | null>(null);

const deleting = ref(false);
const deletingError = ref<string | null>(null);

const delIds = ref<number[]>([]);

const fetchProducts = () => {
  loading.value = true;
  loadingError.value = null;
  getProductsList()
    .then((res) => {
      data.value = res;
      initLoaded.value = true;
    })
    .catch((err) => {
      console.error(err);
      loadingError.value = "Error loading";
    })
    .finally(() => {
      loading.value = false;
    });
};

const deleteProducts = async (ids: number[]) => {
  deleting.value = true;
  deletingError.value = null;
  const res = deleteProductsByIds(ids);
  res
    .catch(() => {
      deletingError.value = "Error deleting";
    })
    .finally(() => {
      deleting.value = false;
    });
  return res;
};

export {
  data,
  initLoaded,
  loading,
  loadingError,
  deleting,
  deletingError,
  delIds,
  fetchProducts,
  deleteProducts,
};

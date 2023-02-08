import Nodes from "nodes";

const ProductListPage: {
  data: any[];
  loading: boolean;
  error: string | null;
} = {
  data: [],
  loading: true,
  error: null,
};

export const { state, dispatch } = Nodes.configureState({
  ProductListPage,
});

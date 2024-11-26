// tipagem estatica como pedido no teste tbm
interface ProductVariant {
  id: string;
  sku: string | null;
  barcode: string | null;
  price: string;
}

export interface Product {
  id: string;
  title: string;
  productType: string;
  description: string;
  variants: ProductVariant[];
}

export interface shopifyResponseSingleProduct {
  data: {
    product: {
      id: string;
      title: string;
      productType: string;
      description: string;
      variants: {
        edges: {
          node: ProductVariant;
        }[];
      };
    };
  };
}

export interface ShopifyResponse {
  data: {
    products: {
      edges: {
        node: {
          id: string;
          title: string;
          productType: string;
          description: string;
          variants: {
            edges: {
              node: ProductVariant;
            }[];
          };
        };
      }[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
}

export interface ShopifyResponseProducts {
  data: {
    productCreate: {
      product: {
        id: string;
        metafields: {
          edges: Array<{
            node: {
              id: string;
              namespace: string;
              key: string;
              value: string;
            };
          }>;
        };
      };
      userErrors: Array<{
        field?: string[];
        message: string;
      }>;
    };
  };
}

export interface ShopifyResponseVariants {
  data: {
    productVariantsBulkCreate: {
      userErrors: {
        field: string[] | null;
        message: string;
      }[];
      product: {
        id: string;
        options: {
          id: string;
          name: string;
          values: string[];
          position: number;
          optionValues: {
            id: string;
            name: string;
            hasVariants: boolean;
          }[];
        }[];
      };
      productVariants: {
        id: string;
        title: string;
        selectedOptions: {
          name: string;
          value: string;
        }[];
      }[];
    };
  };
}

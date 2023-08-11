import { create } from "zustand";
import { useRouter, useSearchParams } from "next/navigation";

import { useAlertService } from "_services";
import { useFetch, formatTimeQuery } from "_helpers/client";

export { useOrderService };

// user state store
const initialState = {
  orders: undefined,
  order: undefined,
  total: undefined,
  currentOrder: undefined,
};
const orderStore = create<IOrderStore>(() => initialState);

function useOrderService(): IOrderService {
  const alertService = useAlertService();
  const fetch = useFetch();
  // const router = useRouter();
  const searchParams = useSearchParams();
  const { orders, order, currentOrder, total } = orderStore();

  return {
    orders,
    order,
    currentOrder,
    getAll: async () => {
      const result = await fetch.get("/api/orders");
      orderStore.setState({ orders: result.data, total: result.total });
    },
    filter: async (queries) => {
      const result = await fetch.post("/api/orders/filter", queries);
      orderStore.setState({ orders: result.data, total: result.total });
      // orderStore.setState({ orders: await fetch.post("/api/orders/filter", queries) });
    },
    getById: async (id) => {
      orderStore.setState({ order: undefined });
      try {
        orderStore.setState({ order: await fetch.get(`/api/orders/${id}`) });
      } catch (error: any) {
        alertService.error(error);
      }
    },
    getCurrent: async () => {
      if (!currentOrder) {
        orderStore.setState({
          currentOrder: await fetch.get("/api/orders/current"),
        });
      }
    },
    create: async (user) => {
      await fetch.post("/api/orders", user);
    },
    update: async (id, params) => {
      await fetch.put(`/api/orders/${id}`, params);

      // update current user if the user updated their own record
      if (id === currentOrder?.id) {
        orderStore.setState({ currentOrder: { ...currentOrder, ...params } });
      }
    },
    delete: async (id) => {
      // set isDeleting prop to true on user
      orderStore.setState({
        orders: orders!.map((x) => {
          if (x.id === id) {
            x.isDeleting = true;
          }
          return x;
        }),
      });

      // delete user
      const response = await fetch.delete(`/api/orders/${id}`);

      // remove deleted user from state
      orderStore.setState({
        orders: orders!.filter((x) => x.id !== id),
        ...(total && { total: total - 1 }),
      });
    },
    changeStatus: async (id, status) => {
      try {
        await fetch.put(`/api/orders/status/${id}`, { status });
        orderStore.setState({
          orders: orders!.map((x) => {
            if (x.id === id) {
              x.status = status;
            }
            return x;
          }),
        });
        alertService.success(`Update order: ${id} status: ${status} success!`);
      } catch (error: any) {
        alertService.success(`Update order: ${id} status: ${status} false!`);
        // alertService.error(error);
      }
    },
    rating: async ({ order, rating, comment }) => {
      await fetch.post(`/api/rating`, { order, rating, comment });
      alertService.success(`Thank you for your rating!`);
    },
  };
}

// interfaces
export interface IOrderAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  postCode: string;
  country: string;
}
interface OrderInput {
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  recipientAddress: IOrderAddress;
  shippingAddress: IOrderAddress;
  shippingAt: Date;
  deliveryAt: Date;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export interface IOrder extends OrderInput {
  id: string;
  status: string;
  rating: {
    rating: number;
    comment: string;
  };
  user: {
    firstName: string;
    lastName: string;
    id: string;
  };
}

interface IOrderStore {
  orders?: IOrder[];
  order?: IOrder;
  total?: number;
  currentOrder?: IOrder;
}

interface IOrderService extends IOrderStore {
  getAll: () => Promise<void>;
  getById: (id: string) => Promise<void>;
  getCurrent: () => Promise<void>;
  create: (order: OrderInput) => Promise<void>;
  update: (id: string, params: Partial<IOrder>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  filter: (queries: any) => Promise<void>;
  changeStatus: (id: string, status: string) => Promise<void>;
  rating: ({
    order,
    rating,
    comment,
  }: {
    order: string;
    rating: number;
    comment: string;
  }) => Promise<void>;
}

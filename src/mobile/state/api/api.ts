import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from 'expo-secure-store';
import { ACCESS_TOKEN_KEY } from '@/constants/StorageKeys';

// Define a simple Fruit type
export interface Fruit {
  id: string;
  name: string;
  color: string;
}

export const fruitsApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5175/",
    prepareHeaders: async (headers) => {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Fruits"],
  endpoints: (builder) => ({
    // GET all fruits
    getFruits: builder.query<Fruit[], void>({
      query: () => "/fruits",
      providesTags: ["Fruits"],
    }),

    // GET a single fruit by id
    getFruit: builder.query<Fruit, string>({
      query: (id: string) => `/fruits/${id}`,
      providesTags: (result, error, id) => [{ type: "Fruits", id }],
    }),

    // CREATE a new fruit with pessimistic update
    createFruit: builder.mutation<Fruit, Fruit>({
      query: (newFruit) => ({
        url: "/fruits",
        method: "POST",
        body: newFruit,
      }),
      async onQueryStarted(newFruit, { dispatch, queryFulfilled }) {
        try {
          // Wait for the server response before updating the cache
          const { data } = await queryFulfilled;
          // After successful creation, add the new fruit to the cached list
          dispatch(
            fruitsApi.util.updateQueryData("getFruits", undefined, (draft: Fruit[]) => {
              draft.push(data);
            })
          );
        } catch (error) {
          // Optionally handle the error (e.g. show a notification)
        }
      },
      invalidatesTags: ["Fruits"],
    }),

    // UPDATE an existing fruit with pessimistic update
    updateFruit: builder.mutation<Fruit, { id: string; data: Partial<Fruit> }>({
      query: ({ id, data }) => ({
        url: `/fruits/${id}`,
        method: "PUT", // or PATCH for partial updates
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          // Wait for the updated fruit from the server
          const { data: updatedFruit } = await queryFulfilled;
          // After a successful update, update the cached list accordingly
          dispatch(
            fruitsApi.util.updateQueryData("getFruits", undefined, (draft: Fruit[]) => {
              const fruit = draft.find((fruit) => fruit.id === id);
              if (fruit) {
                Object.assign(fruit, updatedFruit);
              }
            })
          );
        } catch (error) {
          // Optionally handle the error
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Fruits", id }],
    }),

    // DELETE a fruit with optimistic update
    deleteFruit: builder.mutation<{ success: boolean }, string>({
      query: (id: string) => ({
        url: `/fruits/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistically remove the fruit from the cache
        const patchResult = dispatch(
          fruitsApi.util.updateQueryData("getFruits", undefined, (draft: Fruit[]) => {
            const index = draft.findIndex((fruit) => fruit.id === id);
            if (index !== -1) draft.splice(index, 1);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // Undo the optimistic update if the request fails
          patchResult.undo();
        }
      },
      invalidatesTags: ["Fruits"],
    }),
  }),
});

// Export hooks for use in your components
export const {
  useGetFruitsQuery,
  useGetFruitQuery,
  useCreateFruitMutation,
  useUpdateFruitMutation,
  useDeleteFruitMutation,
} = fruitsApi;

export default fruitsApi;
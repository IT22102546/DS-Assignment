// import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const productsApi = createApi({
//     reducerPath : "productsApi",
//     baseQuery : fetchBaseQuery({ baseUrl :"http://localhost:3000/"}),
//     endpoints : (builder)=>({
//         getAllProducts : builder.query({
//             query: () => "products",
//         }),
//     }),
// });

// export const { useGetAllProductsQuery } = productsApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const natureApi = createApi({
  reducerPath: "natureApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  endpoints: (builder) => ({
    getAllNature: builder.query({
      query: () => ({
        url: "api/nature/getnature",
      }),
    }),
  }),
});

export const { useGetAllNatureQuery } = natureApi;
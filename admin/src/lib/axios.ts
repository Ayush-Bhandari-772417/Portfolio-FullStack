// // // // // // admin/src/lib/axios.ts
// // // // // import axios from "axios";

// // // // // const api = axios.create({
// // // // //   baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., http://127.0.0.1:8000/api/admin
// // // // //   withCredentials: true, // ensures cookies are sent automatically
// // // // // });

// // // // // export default api;

// // // // // admin/src/lib/axios.ts
// // // // import axios from "axios";

// // // // const api = axios.create({
// // // //   baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., http://localhost:8000/api/admin
// // // //   withCredentials: true, // cookies are sent automatically
// // // // });

// // // // // Interceptor to print request cookies
// // // // api.interceptors.request.use((config) => {
// // // //   console.log("==== Frontend Sending Cookies ====");
// // // //   console.log(document.cookie); // prints all non-HttpOnly cookies visible to JS
// // // //   console.log(config);
// // // //   console.log("=================================");
// // // //   return config;
// // // // });

// // // // export default api;


// // // // admin/src/lib/axios.ts
// // // import axios from "axios";

// // // const api = axios.create({
// // //   baseURL: process.env.NEXT_PUBLIC_API_URL,
// // //   withCredentials: true,
// // // });

// // // export default api;

// // // admin\src\lib\axios.ts
// // import axios from "axios";

// // const api = axios.create({
// //   baseURL: process.env.NEXT_PUBLIC_API_URL,
// //   withCredentials: true, // 🔴 REQUIRED
// // });

// // export default api;

// // admin\src\lib\axios.ts
// import axios from "axios";
// const api = axios.create({
//   baseURL: "/api/admin",        // ← Best option (relative = always same-origin)
//   withCredentials: true,
// });

// export default api;


// admin\src\lib\axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api/admin",           // ← this is the key change
  withCredentials: true,
});

export default api;
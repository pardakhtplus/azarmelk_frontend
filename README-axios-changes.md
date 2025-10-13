# Axios Implementation with Interceptors

## Changes Made

1. Installed Axios: `npm install axios --legacy-peer-deps`

2. Created a new axios client with interceptors in `src/lib/axios-client.ts`:

   - Set up axios with base configuration
   - Added request interceptor to automatically add authentication token
   - Added response interceptor to handle token refresh on 401 errors
   - Added utility functions for common API requests (get, post, put, patch, delete)
   - Added specific API endpoint functions

3. Updated `src/hooks/api.ts`:

   - Replaced fetch calls with the new axios client methods
   - Imported the handleQueries function from axios-client

4. Removed `fetchWithRefreshToken` function from `src/lib/utils.tsx`:
   - This functionality is now handled by axios interceptors

## How It Works

1. **Request Interceptor**:

   - Automatically adds Authorization header with access token to every request
   - Handles authentication without manual token management

2. **Response Interceptor**:

   - Automatically detects 401 (Unauthorized) errors
   - Attempts to refresh the token
   - Retries the original request with new token
   - Handles logout if refresh token is invalid
   - Handles 403 (Forbidden) errors

3. **API Service Methods**:
   - Provides simplified methods for API requests
   - Handles query string formatting
   - Returns typed responses

## Usage Example

```typescript
import { api, apiService } from "@/lib/axios-client";

// Using predefined API endpoints
const userInfo = await api.IAM.getUserInfo();

// Using generic API methods
const data = await apiService.get("/api/v1/path/to/resource", {
  param1: "value1",
});
const result = await apiService.post("/api/v1/path/to/resource", {
  field: "value",
});
```

## FormData Support (Latest Update)

### مشکل

وقتی `FormData` به API ارسال می‌شد، `Content-Type` به صورت خودکار به `multipart/form-data` تغییر نمی‌کرد و همچنان `application/json` باقی می‌ماند.

### راه حل

تغییرات زیر در `src/services/axios-client.ts` اعمال شد:

#### 1. Request Interceptor

```typescript
// Request interceptor
axiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // If data is FormData, remove Content-Type header to let browser set it automatically
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
```

#### 2. API Service Methods

```typescript
export const apiService = {
  post: <T>(url: string, data?: any): Promise<AxiosResponse<T>> => {
    // If data is FormData, don't set Content-Type header
    const config = data instanceof FormData ? { headers: {} } : {};
    return axiosClient.post(buildUrlWithQuery(url), data, config);
  },

  put: <T>(url: string, data?: any): Promise<AxiosResponse<T>> => {
    // If data is FormData, don't set Content-Type header
    const config = data instanceof FormData ? { headers: {} } : {};
    return axiosClient.put(buildUrlWithQuery(url), data, config);
  },

  patch: <T>(url: string, data?: any): Promise<AxiosResponse<T>> => {
    // If data is FormData, don't set Content-Type header
    const config = data instanceof FormData ? { headers: {} } : {};
    return axiosClient.patch(buildUrlWithQuery(url), data, config);
  },

  // Helper methods specifically for FormData
  postFormData: <T>(
    url: string,
    formData: FormData,
  ): Promise<AxiosResponse<T>> => {
    return axiosClient.post(buildUrlWithQuery(url), formData, {
      headers: {
        // Let browser set Content-Type automatically for FormData
      },
    });
  },

  putFormData: <T>(
    url: string,
    formData: FormData,
  ): Promise<AxiosResponse<T>> => {
    return axiosClient.put(buildUrlWithQuery(url), formData, {
      headers: {
        // Let browser set Content-Type automatically for FormData
      },
    });
  },
};
```

### نحوه استفاده

#### روش 1: استفاده از متدهای معمولی

```typescript
const formData = new FormData();
formData.append("file", file);
formData.append("name", "test");

// Content-Type به صورت خودکار تنظیم می‌شود
apiService.post("/upload", formData);
```

#### روش 2: استفاده از متدهای مخصوص FormData

```typescript
const formData = new FormData();
formData.append("file", file);
formData.append("name", "test");

// استفاده از متد مخصوص FormData
apiService.postFormData("/upload", formData);
```

#### مثال کامل

```typescript
// در کامپوننت
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("type", "image");

  try {
    const response = await apiService.post("/api/upload", formData);
    console.log("Upload successful:", response.data);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### نکات مهم

1. وقتی `FormData` ارسال می‌کنید، `Content-Type` به صورت خودکار به `multipart/form-data` تغییر می‌کند
2. برای داده‌های JSON معمولی، همچنان `Content-Type: application/json` استفاده می‌شود
3. متدهای `postFormData` و `putFormData` برای استفاده راحت‌تر از FormData اضافه شده‌اند
4. تمام تغییرات backward compatible هستند و کدهای موجود را تحت تأثیر قرار نمی‌دهند

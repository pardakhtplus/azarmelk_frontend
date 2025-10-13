import { type ESTATE_STATUS } from "@/enums";
import { getCookie, removeCookie, setCookie } from "@/lib/server-utils";
import { type TMutateRegion } from "@/types/admin/category/types";
import type { REQUEST_STATUS } from "@/types/admin/estate/enum";
import {
  type TCreateRequest,
  type TEditRequestInfo,
  type TGetRequestListParams,
  type TMutateEstate,
} from "@/types/admin/estate/types";
import {
  type TCreateReminder,
  type TEditReminder,
  type TReminderListParams,
} from "@/types/admin/estate/reminder.types";
import { type TMutateLanding } from "@/types/admin/landing/types";
import { type TMutateOwner } from "@/types/admin/owner/types";
import { type SESSION_STATUS } from "@/types/admin/session/enum";
import { type TMutateSession } from "@/types/admin/session/type";
import {
  type TMutatePersonalInfo,
  type TMutateUser,
} from "@/types/admin/users/types";
import {
  type TEditProfile,
  type TForgetPassword,
  type TLogin,
  type TSendOtp,
} from "@/types/client/auth/types";
import { type TCreateEstateRequest } from "@/types/client/dashboard/estate/request/types";
import {
  type TPostAdvisorContactLog,
  type TGetEstateListParamsClient,
} from "@/types/client/estate/types";
import { type TGetEstateListParams } from "@/types/types";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { toast } from "react-hot-toast";
import { API_CONFIG, buildUrlWithQuery } from "./api-config";

/**
 * Axios Client Configuration
 *
 * This client automatically handles:
 * - Token management and refresh
 * - FormData content-type handling
 * - Request/response interceptors
 *
 * Usage examples:
 *
 * // Regular JSON data
 * apiService.post('/endpoint', { key: 'value' });
 *
 * // FormData (Content-Type will be set automatically)
 * const formData = new FormData();
 * formData.append('file', file);
 * formData.append('name', 'test');
 * apiService.post('/upload', formData);
 *
 * // Or use the dedicated FormData methods
 * apiService.postFormData('/upload', formData);
 */

// Token cache for client-side
let accessTokenCache: string | null = null;
let isTokenBeingFetched = false;
let tokenPromise: Promise<string | null> | null = null;

// Function to get token (from cache or server)
const getAccessToken = async (): Promise<string | null> => {
  // Return from cache if available
  if (accessTokenCache) {
    return accessTokenCache;
  }

  // If a fetch is already in progress, wait for it
  if (isTokenBeingFetched && tokenPromise) {
    return tokenPromise;
  }

  // Start new fetch
  isTokenBeingFetched = true;
  tokenPromise = new Promise<string | null>(async (resolve) => {
    try {
      const token = await getCookie("accessToken");
      accessTokenCache = token ?? null;
      resolve(accessTokenCache);
    } catch (error) {
      console.error("Error fetching token:", error);
      resolve(null);
    } finally {
      isTokenBeingFetched = false;
    }
  });

  return tokenPromise;
};

// Default configuration for axios
const axiosConfig: AxiosRequestConfig = {
  baseURL: API_CONFIG.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000, // Default timeout
};

// Create axios instance
const axiosClient: AxiosInstance = axios.create(axiosConfig);

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

// Response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Handle 401 (Unauthorized) - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Clear token cache
        accessTokenCache = null;

        // Request new access token
        const response = await axios.post(
          buildUrlWithQuery(API_CONFIG.endpoints.client.IAM.refreshToken),
          {
            refresh_token: await getCookie("refreshToken"),
          },
        );

        if (response.status < 300) {
          // Update token cache if response contains token
          if (response.data?.accessToken) {
            accessTokenCache = response.data.accessToken;
            setCookie("accessToken", response.data.accessToken);
            setCookie("refreshToken", response.data.refreshToken);
          } else {
            // Fetch fresh token from cookie after refresh
            const newToken = await getCookie("accessToken");
            accessTokenCache = newToken ?? null;
          }

          // Retry original request with new token
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid, logout user
        accessTokenCache = null;
        await removeCookie("refreshToken");
        await removeCookie("accessToken");

        if (typeof window !== "undefined") {
          window.location.reload();
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 403 (Forbidden) - No permissions
    if (error.response?.status === 403) {
      accessTokenCache = null;
      await removeCookie("refreshToken");
      await removeCookie("accessToken");

      if (typeof window !== "undefined") {
        toast.error("حساب شما مسدود است!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }

    return Promise.reject(error);
  },
);

// Helper functions
export const handleQueries = (
  queries: Record<string, string | number | boolean | undefined> | undefined,
) => {
  if (!queries) return "";
  return Object.entries(queries)
    .filter(([_, value]) => value?.toString())
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");
};

// Function to manually update token cache (call this after login)
export const updateTokenCache = (token: string) => {
  accessTokenCache = token;
};

// Function to clear token cache (call this on logout)
export const clearTokenCache = () => {
  accessTokenCache = null;
};

// Export instance and API methods
export default axiosClient;

// Common API methods with axios
export const apiService = {
  get: <T>(
    url: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<AxiosResponse<T>> => {
    return axiosClient.get(buildUrlWithQuery(url, params));
  },

  post: <T>(
    url: string,
    data?: any,
    config?: any,
  ): Promise<AxiosResponse<T>> => {
    // If data is FormData, don't set Content-Type header
    const defaultConfig = data instanceof FormData ? { headers: {} } : {};
    const finalConfig = { ...defaultConfig, ...config };
    return axiosClient.post(buildUrlWithQuery(url), data, finalConfig);
  },

  put: <T>(
    url: string,
    data?: any,
    config?: any,
  ): Promise<AxiosResponse<T>> => {
    // If data is FormData, don't set Content-Type header
    const defaultConfig = data instanceof FormData ? { headers: {} } : {};
    const finalConfig = { ...defaultConfig, ...config };
    return axiosClient.put(buildUrlWithQuery(url), data, finalConfig);
  },

  patch: <T>(
    url: string,
    data?: any,
    config?: any,
  ): Promise<AxiosResponse<T>> => {
    // If data is FormData, don't set Content-Type header
    const defaultConfig = data instanceof FormData ? { headers: {} } : {};
    const finalConfig = { ...defaultConfig, ...config };
    return axiosClient.patch(buildUrlWithQuery(url), data, finalConfig);
  },

  delete: <T>(url: string, config?: any): Promise<AxiosResponse<T>> => {
    const defaultConfig = config ? { ...config } : {};
    return axiosClient.delete(buildUrlWithQuery(url), defaultConfig);
  },

  // Helper method specifically for FormData
  postFormData: <T>(
    url: string,
    formData: FormData,
    config?: any,
  ): Promise<AxiosResponse<T>> => {
    const defaultConfig = config ? { ...config } : {};
    return axiosClient.post(buildUrlWithQuery(url), formData, defaultConfig);
  },

  putFormData: <T>(
    url: string,
    formData: FormData,
    config?: any,
  ): Promise<AxiosResponse<T>> => {
    const defaultConfig = config ? { ...config } : {};
    return axiosClient.put(buildUrlWithQuery(url), formData, defaultConfig);
  },
};

// API endpoints
export const api = {
  admin: {
    estate: {
      getList: (params?: TGetEstateListParams) =>
        apiService.get(
          API_CONFIG.endpoints.admin.estate.getList +
            "?" +
            handleQueries({ ...params }),
        ),
      get: (id: string) =>
        apiService.get(API_CONFIG.endpoints.admin.estate.get, { id }),
      getLogList: (id: string) =>
        apiService.get(
          API_CONFIG.endpoints.admin.estate.getLogList +
            "?" +
            handleQueries({ id }),
        ),
      getCreatedList: (params?: TGetEstateListParams) =>
        apiService.get(
          API_CONFIG.endpoints.admin.estate.getCreatedList +
            "?" +
            handleQueries({ ...params }),
        ),

      create: (data: TMutateEstate) =>
        apiService.post(API_CONFIG.endpoints.admin.estate.create, data),
      edit: (id: string, data: TMutateEstate) =>
        apiService.put(
          API_CONFIG.endpoints.admin.estate.edit + "?" + handleQueries({ id }),
          data,
        ),

      createRequest: (data: TCreateRequest) =>
        apiService.post(API_CONFIG.endpoints.admin.estate.createRequest, data),
      getRequestList: (params: TGetRequestListParams) =>
        apiService.get(API_CONFIG.endpoints.admin.estate.getRequestList, {
          ...params,
        }),
      getOwnRequestList: (params: TGetRequestListParams) =>
        apiService.get(API_CONFIG.endpoints.admin.estate.getOwnRequestList, {
          ...params,
        }),
      getRequestInfo: (id: string) =>
        apiService.get(
          API_CONFIG.endpoints.admin.estate.getRequestInfo +
            "?" +
            handleQueries({ id }),
        ),
      editRequestStatus: (params: {
        requestId: string;
        note: string;
        status: REQUEST_STATUS;
      }) =>
        apiService.put(
          API_CONFIG.endpoints.admin.estate.editRequestStatus,
          params,
        ),
      editRequestInfo: (params: { id: string }, data: TEditRequestInfo) =>
        apiService.put(
          API_CONFIG.endpoints.admin.estate.editRequestInfo +
            "?" +
            handleQueries({
              id: params.id,
            }),
          data,
        ),
      editStatus: (params: { estateId: string; status: ESTATE_STATUS }) =>
        apiService.put(API_CONFIG.endpoints.admin.estate.editStatus, params),

      getAdviserList: (params: {
        page: number;
        limit: number;
        search: string;
      }) =>
        apiService.get(
          API_CONFIG.endpoints.admin.estate.getAdviserList +
            "?" +
            handleQueries({
              page: params.page,
              limit: params.limit,
              search: params.search,
            }),
        ),
      editAdviserEstate: (data: {
        newAdviserId: string;
        oldAdviserId: string;
      }) =>
        apiService.put(
          API_CONFIG.endpoints.admin.estate.editAdviserEstate,
          data,
        ),
      note: {
        create: (params: { id: string; note: string }) =>
          apiService.post(
            API_CONFIG.endpoints.admin.estate.note.create +
              "?" +
              handleQueries({
                id: params.id,
              }),
            {
              note: params.note,
            },
          ),
        edit: (params: { id: string; note: string }) =>
          apiService.put(
            API_CONFIG.endpoints.admin.estate.note.edit +
              "?" +
              handleQueries({
                id: params.id,
              }),
            {
              note: params.note,
            },
          ),
        getList: (params: { id: string }) =>
          apiService.get(
            API_CONFIG.endpoints.admin.estate.note.getList +
              "?" +
              handleQueries({
                id: params.id,
              }),
          ),
      },
    },
    owner: {
      getList: (params?: { page?: number; limit?: number; search?: string }) =>
        apiService.get(
          API_CONFIG.endpoints.admin.owner.getList +
            "?" +
            handleQueries({ ...params }),
        ),
      get: (id: string) =>
        apiService.get(API_CONFIG.endpoints.admin.owner.get, { id }),
      create: (data: TMutateOwner) =>
        apiService.post(API_CONFIG.endpoints.admin.owner.create, data),
      edit: (data: TMutateOwner) =>
        apiService.put(
          API_CONFIG.endpoints.admin.owner.edit +
            "?" +
            handleQueries({ ...data }),
        ),
      getEstateList: ({
        phoneNumber,
        categoryId,
      }: {
        phoneNumber: string;
        categoryId: string;
      }) =>
        apiService.get(
          API_CONFIG.endpoints.admin.owner.getEstateList +
            "?" +
            handleQueries({ phoneNumber, categoryId }),
        ),
    },
    bucket: {
      uploadFiles: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiService.post(
          API_CONFIG.endpoints.admin.bucket.uploadFiles,
          formData,
        );
      },
      uploadChunkFiles: (data: {
        chunk?: Blob;
        index?: number;
        totalChunks: number;
        uploadId: string;
        key: string;
        fileName: string;
        fileType: string;
        type?: string;
        signal?: AbortSignal;
        parts?: {
          ETag: string;
          PartNumber: number;
        }[];
      }) => {
        const formData = new FormData();
        formData.append("uploadId", data.uploadId || "0");
        formData.append("fileName", data.fileName);
        if (data.type) formData.append("type", data.type);
        formData.append("key", data.key || "0");
        if (data.fileType) formData.append("fileType", data.fileType);

        if (data.index === data.totalChunks - 1 && data.parts) {
          formData.append("parts", JSON.stringify(data.parts));
          // formData.append("fileType", data.fileType);
        }

        if (data.chunk) {
          formData.append(
            `files[${data.index}][${data.totalChunks}]`,
            data.chunk,
          );
        }

        return apiService.post(
          API_CONFIG.endpoints.admin.bucket.uploadChunkFiles,
          formData,
          {
            timeout: 10000000000,
            signal: data.signal,
          },
        );
      },
      uploadWaterMarkedChunkFiles: (data: {
        chunk?: Blob;
        index?: number;
        totalChunks: number;
        uploadId: string;
        key: string;
        fileName: string;
        fileType: string;
        type?: string;
        signal?: AbortSignal;
        parts?: {
          ETag: string;
          PartNumber: number;
        }[];
      }) => {
        const formData = new FormData();
        formData.append("uploadId", data.uploadId || "0");
        formData.append("fileName", data.fileName);
        if (data.type) formData.append("type", data.type);
        formData.append("key", data.key || "0");
        if (data.fileType) formData.append("fileType", data.fileType);

        if (data.index === data.totalChunks - 1 && data.parts) {
          formData.append("parts", JSON.stringify(data.parts));
          // formData.append("fileType", data.fileType);
        }

        if (data.chunk) {
          formData.append(
            `files[${data.index}][${data.totalChunks}]`,
            data.chunk,
          );
        }

        return apiService.post(
          API_CONFIG.endpoints.admin.bucket.uploadWaterMarkedChunkFiles,
          formData,
          {
            timeout: 10000000000,
            signal: data.signal,
          },
        );
      },
    },
    session: {
      create: (data: TMutateSession) =>
        apiService.post(API_CONFIG.endpoints.admin.session.create, {
          ...data,
          maximumBudget: 20000,
          lowestSellingPrice: 20000,
        }),
      createSessionDate: (data: { title: string; date: string }) =>
        apiService.post(
          API_CONFIG.endpoints.admin.session.createSessionDate,
          data,
        ),
      edit: (data: TMutateSession) =>
        apiService.put(
          API_CONFIG.endpoints.admin.session.edit +
            "?" +
            handleQueries({
              id: data.id,
            }),
          data,
        ),
      editStatus: ({
        id,
        status,
        note,
      }: {
        id: string;
        status: SESSION_STATUS;
        note?: string;
      }) =>
        apiService.put(
          API_CONFIG.endpoints.admin.session.editStatus +
            "?" +
            handleQueries({
              id,
              status,
              note,
            }),
        ),
      get: (id: string) =>
        apiService.get(
          API_CONFIG.endpoints.admin.session.get +
            "?" +
            handleQueries({
              id,
            }),
        ),
      getList: (params: { day: string; room: number }) =>
        apiService.get(API_CONFIG.endpoints.admin.session.getList, params),
      getCreatedList: (params: { day: string; room: number }) =>
        apiService.get(
          API_CONFIG.endpoints.admin.session.getCreatedList,
          params,
        ),
      getSessionDateList: (params: { day: string }) =>
        apiService.get(
          API_CONFIG.endpoints.admin.session.getSessionDateList,
          params,
        ),
      getCountList: (params: { start: string; end: string }) =>
        apiService.get(API_CONFIG.endpoints.admin.session.countList, params),
      getCountCreatedList: (params: { start: string; end: string }) =>
        apiService.get(
          API_CONFIG.endpoints.admin.session.countCreatedList,
          params,
        ),
      getLogList: (id: string) =>
        apiService.get(
          API_CONFIG.endpoints.admin.session.getLogList +
            "?" +
            handleQueries({ id }),
        ),
      deleteSessionDate: (params: { id: string }) =>
        apiService.delete(
          API_CONFIG.endpoints.admin.session.deleteSessionDate +
            "?" +
            handleQueries({
              id: params.id,
            }),
        ),
      note: {
        create: (params: { id: string; note: string }) =>
          apiService.post(
            API_CONFIG.endpoints.admin.session.note.create +
              "?" +
              handleQueries({
                id: params.id,
              }),
            {
              note: params.note,
            },
          ),
        edit: (params: { id: string; note: string }) =>
          apiService.put(
            API_CONFIG.endpoints.admin.session.note.edit +
              "?" +
              handleQueries({
                id: params.id,
              }),
            {
              note: params.note,
            },
          ),
        getList: (params: { id: string }) =>
          apiService.get(
            API_CONFIG.endpoints.admin.session.note.getList +
              "?" +
              handleQueries({
                id: params.id,
              }),
          ),
      },
    },
    management: {
      getUsers: (params: {
        page: number;
        limit: number;
        role?: string;
        search?: string;
      }) =>
        apiService.get(API_CONFIG.endpoints.admin.management.userList, params),
      getUserInfo: (id: string) =>
        apiService.get(API_CONFIG.endpoints.admin.management.userInfo, { id }),
      getPersonalInfo: (id: string) =>
        apiService.get(API_CONFIG.endpoints.admin.management.personalInfo, {
          id,
        }),
      editUser: (id: string, data: TMutateUser) =>
        apiService.put(
          API_CONFIG.endpoints.admin.management.editUser +
            "?" +
            handleQueries({
              id,
            }),
          data,
        ),
      editPersonalInfo: (id: string, data: TMutatePersonalInfo) =>
        apiService.put(
          API_CONFIG.endpoints.admin.management.editPersonalInfo +
            "?" +
            handleQueries({
              id,
            }),
          data,
        ),
      editUserStatus: (id: string, status: boolean) =>
        apiService.put(
          API_CONFIG.endpoints.admin.management.editUserStatus +
            "?" +
            handleQueries({
              userId: id,
              status: status,
            }),
        ),
    },
    category: {
      getMainCategories: () =>
        apiService.get(API_CONFIG.endpoints.admin.category.getMainCategories),
      getRegions: (id: string) =>
        apiService.get(API_CONFIG.endpoints.admin.category.getRegions, { id }),
      createRegion: (data: TMutateRegion) =>
        apiService.post(API_CONFIG.endpoints.admin.category.createRegion, data),
      editRegion: (data: TMutateRegion) =>
        apiService.put(
          API_CONFIG.endpoints.admin.category.editRegion +
            "?" +
            handleQueries({
              id: data.id,
            }),
          data,
        ),
      deleteRegion: (id: string) =>
        apiService.delete(
          API_CONFIG.endpoints.admin.category.deleteRegion +
            "?" +
            handleQueries({
              id,
            }),
        ),
    },
    landing: {
      getList: (params: { page: number; limit: number }) =>
        apiService.get(API_CONFIG.endpoints.admin.landing.getList, params),
      get: (id: string) =>
        apiService.get(
          API_CONFIG.endpoints.admin.landing.get +
            "?" +
            handleQueries({
              landingId: id,
            }),
        ),
      create: (data: TMutateLanding) =>
        apiService.post(API_CONFIG.endpoints.admin.landing.create, data),
      edit: (id: string, data: TMutateLanding) =>
        apiService.put(
          API_CONFIG.endpoints.admin.landing.edit +
            "?" +
            handleQueries({
              id,
            }),
          data,
        ),
      delete: (id: string) =>
        apiService.delete(
          API_CONFIG.endpoints.admin.landing.delete +
            "?" +
            handleQueries({
              landingId: id,
            }),
        ),
    },
    notification: {
      getList: (params?: { page?: number; limit?: number }) =>
        apiService.get(
          API_CONFIG.endpoints.admin.notification.getList +
            "?" +
            handleQueries({ ...params }),
        ),
    },
    reminder: {
      create: (data: TCreateReminder) =>
        apiService.post(API_CONFIG.endpoints.admin.reminder.create, data),
      getList: (params?: TReminderListParams) =>
        apiService.get(
          API_CONFIG.endpoints.admin.reminder.getList +
            "?" +
            handleQueries({ ...params }),
        ),
      get: (id: string) =>
        apiService.get(API_CONFIG.endpoints.admin.reminder.get, { id }),
      edit: (data: TEditReminder) =>
        apiService.put(API_CONFIG.endpoints.admin.reminder.edit, data),
      delete: (id: string) =>
        apiService.delete(
          API_CONFIG.endpoints.admin.reminder.delete +
            "?" +
            handleQueries({ id }),
        ),
    },
  },
  client: {
    landing: {
      get: (params: { slug: string; page: number; limit: number }) =>
        apiService.get(
          API_CONFIG.endpoints.client.landing.get +
            "?" +
            handleQueries({
              slug: params.slug,
              page: params.page,
              limit: params.limit,
            }),
        ),
    },
    estate: {
      getList: (params?: TGetEstateListParamsClient) =>
        apiService.get(
          API_CONFIG.endpoints.client.estate.getList +
            "?" +
            handleQueries({ ...params }),
        ),
      get: (id: string) =>
        apiService.get(API_CONFIG.endpoints.client.estate.get, { id }),
      getAdvisorContactLogs: (userId: string) =>
        apiService.get(
          API_CONFIG.endpoints.client.estate.getAdvisorContactLogs,
          { userId },
        ),
      postAdvisorContactLog: (data: TPostAdvisorContactLog) =>
        apiService.post(
          API_CONFIG.endpoints.client.estate.postAdvisorContactLog,
          data,
        ),
    },
    category: {
      getFilterList: (params: {
        search: string;
        page: number;
        limit: number;
      }) =>
        apiService.get(
          API_CONFIG.endpoints.client.category.getFilterList +
            "?" +
            handleQueries(params),
        ),
    },
    IAM: {
      refreshToken: async () =>
        apiService.post(API_CONFIG.endpoints.client.IAM.refreshToken, {
          refresh_token: await getCookie("refreshToken"),
        }),
      sendOtp: (data: TSendOtp) =>
        apiService.post(API_CONFIG.endpoints.client.IAM.sendOtp, data),
      login: (data: TLogin) =>
        apiService.post(API_CONFIG.endpoints.client.IAM.login, data),
      forgetPassword: (data: TForgetPassword) =>
        apiService.post(API_CONFIG.endpoints.client.IAM.forgetPassword, data),
      editProfile: (data: TEditProfile) =>
        apiService.put(API_CONFIG.endpoints.client.IAM.userEditProfile, data),
      getUserInfo: () =>
        apiService.get(API_CONFIG.endpoints.client.IAM.userGetInfo),
    },

    bucket: {
      uploadWaterMarkedChunkFiles: (data: {
        chunk?: Blob;
        index?: number;
        totalChunks: number;
        uploadId: string;
        key: string;
        fileName: string;
        fileType: string;
        type?: string;
        signal?: AbortSignal;
        parts?: {
          ETag: string;
          PartNumber: number;
        }[];
      }) => {
        const formData = new FormData();
        formData.append("uploadId", data.uploadId || "0");
        formData.append("fileName", data.fileName);
        if (data.type) formData.append("type", data.type);
        formData.append("key", data.key || "0");
        if (data.fileType) formData.append("fileType", data.fileType);

        if (data.index === data.totalChunks - 1 && data.parts) {
          formData.append("parts", JSON.stringify(data.parts));
          // formData.append("fileType", data.fileType);
        }

        if (data.chunk) {
          formData.append(
            `files[${data.index}][${data.totalChunks}]`,
            data.chunk,
          );
        }

        return apiService.post(
          API_CONFIG.endpoints.client.bucket.uploadWaterMarkedChunkFiles,
          formData,
          {
            timeout: 10000000000,
            signal: data.signal,
          },
        );
      },
    },

    // DASHBOARD (user-panel)
    dashboard: {
      estate: {
        getSavedEstateList: (params?: TGetEstateListParamsClient) =>
          apiService.get(
            API_CONFIG.endpoints.client.dashboard.estate.getSavedEstateList +
              "?" +
              handleQueries({ ...params }),
          ),
        getList: (params?: TGetEstateListParamsClient) =>
          apiService.get(
            API_CONFIG.endpoints.client.dashboard.estate.getList +
              "?" +
              handleQueries({ ...params }),
          ),
        get: (id: string) =>
          apiService.get(API_CONFIG.endpoints.client.dashboard.estate.get, {
            id,
          }),

        toggleSave: (id: string) =>
          apiService.post(
            API_CONFIG.endpoints.client.dashboard.estate.toggleSave,
            {
              id,
            },
          ),
        create: (data: TMutateEstate) =>
          apiService.post(
            API_CONFIG.endpoints.client.dashboard.estate.create,
            data,
          ),
        edit: (id: string, data: TMutateEstate) =>
          apiService.put(
            API_CONFIG.endpoints.client.dashboard.estate.edit +
              "?" +
              handleQueries({ id }),
            data,
          ),

        request: {
          getRequestList: (params: {
            page?: number;
            limit?: number;
            search?: string;
          }) =>
            apiService.get(
              API_CONFIG.endpoints.client.dashboard.estate.request
                .getRequestList,
              params,
            ),

          getRequest: (id: string) =>
            apiService.get(
              API_CONFIG.endpoints.client.dashboard.estate.request.getRequest,
              { id },
            ),

          createRequest: (data: TCreateEstateRequest) =>
            apiService.post(
              API_CONFIG.endpoints.client.dashboard.estate.request
                .createRequest,
              data,
            ),

          editRequest: (data: TCreateEstateRequest) =>
            apiService.post(
              API_CONFIG.endpoints.client.dashboard.estate.request
                .createRequest +
                "?" +
                handleQueries({ id: data.id }),
              data,
            ),
        },
      },
      owner: {
        getList: (params?: { page?: number; limit?: number }) =>
          apiService.get(
            API_CONFIG.endpoints.client.dashboard.owner.getList,
            params,
          ),
        get: (id: string) =>
          apiService.get(API_CONFIG.endpoints.client.dashboard.owner.get, {
            id,
          }),
        create: (data: TMutateOwner) =>
          apiService.post(
            API_CONFIG.endpoints.client.dashboard.owner.create,
            data,
          ),
        edit: (data: TMutateOwner) =>
          apiService.put(
            API_CONFIG.endpoints.client.dashboard.owner.edit +
              "?" +
              handleQueries({ ...data }),
          ),
        getEstateList: ({
          phoneNumber,
          categoryId,
        }: {
          phoneNumber: string;
          categoryId: string;
        }) =>
          apiService.get(
            API_CONFIG.endpoints.client.dashboard.owner.getEstateList +
              "?" +
              handleQueries({ phoneNumber, categoryId }),
          ),
      },
    },
  },
  // Additional API endpoints can be added here
};

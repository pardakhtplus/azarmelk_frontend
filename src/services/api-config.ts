// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  endpoints: {
    admin: {
      owner: {
        getList: "/api/v1/admin/owner/getList",
        get: "/api/v1/admin/owner/get", // ? id
        create: "/api/v1/admin/owner/create",
        edit: "/api/v1/admin/owner/edit", // ? id
        getEstateList: "/api/v1/admin/owner/getEstateList", // ? id
      },
      estate: {
        getList: "/api/v1/admin/estate/getList",
        get: "/api/v1/admin/estate/get", // ? id
        getLogList: "/api/v1/admin/estate/getLogList", // ? id
        getCreatedList: "/api/v1/admin/estate/getCreatedList", // ? id
        create: "/api/v1/admin/estate/create",
        edit: "/api/v1/admin/estate/edit", // ? id

        createRequest: "/api/v1/admin/estate/createRequest",
        getRequestList: "/api/v1/admin/estate/getRequestList",
        getOwnRequestList: "/api/v1/admin/estate/getOwnRequestList",
        getRequestInfo: "/api/v1/admin/estate/getRequestInfo", // ? id
        editRequestStatus: "/api/v1/admin/estate/editRequestStatus",
        editRequestInfo: "/api/v1/admin/estate/editRequestInfo",
        editStatus: "/api/v1/admin/estate/editStatus",

        getAdviserList: "/api/v1/admin/estate/getAdviserList", // ? id
        editAdviserEstate: "/api/v1/admin/estate/editAdviserEstate", // ? newAdviserId: string & oldAdviserId: string

        note: {
          create: "/api/v1/admin/estateNote/create", // ? id
          edit: "/api/v1/admin/estateNote/edit", // ? id
          getList: "/api/v1/admin/estateNote/getList", // ? id
        },
      },
      bucket: {
        uploadFiles: "/api/v1/admin/bucket/uploadFiles",
        uploadChunkFiles: "/api/v1/admin/bucket/uploadChunkFiles",
        uploadWaterMarkedChunkFiles:
          "/api/v1/admin/bucket/uploadWaterMarkedChunkFiles",
      },
      session: {
        create: "/api/v1/admin/session/create",
        edit: "/api/v1/admin/session/edit", // ? id
        editStatus: "/api/v1/admin/session/editStatus", // ? id & status: CONFIRMED | REJECTED | CANCELED & note: string
        get: "/api/v1/admin/session/get", // ? id
        getList: "/api/v1/admin/session/getList", // ? day: date & room: number
        getCreatedList: "/api/v1/admin/session/getCreatedList", // ? day: date & room: number
        countList: "/api/v1/admin/session/getCountList", // ? start: date & end: date
        countCreatedList: "/api/v1/admin/session/getCountCreatedList", // ? start: date & end: date
        getLogList: "/api/v1/admin/session/getLogList", // ? id

        createSessionDate: "/api/v1/admin/session/createDate", // ? date : string & title: string
        deleteSessionDate: "/api/v1/admin/session/deleteDate", // ? id
        getSessionDateList: "/api/v1/admin/session/getDateList", // ? day: string

        note: {
          create: "/api/v1/admin/sessionNote/create", // ? id
          edit: "/api/v1/admin/sessionNote/edit", // ? id
          getList: "/api/v1/admin/sessionNote/getList", // ? id
        },
      },
      management: {
        userList: "/api/v1/admin/management/user/getList",
        userInfo: "/api/v1/admin/management/user/get", // ? id
        personalInfo: "/api/v1/admin/management/personal/get", // ? id
        editUser: "/api/v1/admin/management/user/edit", // ? id
        editPersonalInfo: "/api/v1/admin/management/personal/edit", // ? id
        editUserStatus: "/api/v1/admin/management/status/edit", // ? id
      },
      category: {
        getMainCategories: "/api/v1/admin/category/getList",
        getRegions: "/api/v1/admin/category/get",
        createRegion: "/api/v1/admin/category/create",
        editRegion: "/api/v1/admin/category/edit",
        deleteRegion: "/api/v1/admin/category/delete",
      },
      landing: {
        getList: "/api/v1/admin/landing/getList",
        get: "/api/v1/admin/landing/getinfo", // ? id
        create: "/api/v1/admin/landing/create",
        edit: "/api/v1/admin/landing/edit", // ? id
        delete: "/api/v1/admin/landing/delete", // ? id
      },

      notification: {
        getList: "/api/v1/admin/notification/getList",
        read: "/api/v1/admin/notification/update",
      },

      reminder: {
        create: "/api/v1/admin/reminder/create",
        getList: "/api/v1/admin/reminder/getList",
        get: "/api/v1/admin/reminder/get",
        edit: "/api/v1/admin/estate/editReminder",
        delete: "/api/v1/admin/estate/deleteReminder",
      },
    },
    client: {
      landing: {
        get: "/api/v1/client/website/getLanding", // ? id
      },
      estate: {
        getList: "/api/v1/client/estate/getList",
        get: "/api/v1/client/estate/get", // ? id

        getAdvisorContactLogs: "/api/v1/client/estate/advisorContactLogs",
        postAdvisorContactLog: "/api/v1/client/estate/advisorContactLog",
      },
      category: {
        getFilterList: "/api/v1/client/category/getFilterList",
      },
      bucket: {
        uploadFiles: "/api/v1/client/bucket/uploadFiles",
        uploadWaterMarkedChunkFiles:
          "/api/v1/client/bucket/uploadWaterMarkedChunkFiles",
      },
      IAM: {
        userInfo: "/api/v1/client/iam/auth/userInfo",
        refreshToken:
          "/api/v1/client/iam/requestNewAccessTokenWithRefreshToken",
        sendOtp: "/api/v1/client/iam/auth/sendOTP",
        login: "/api/v1/client/iam/auth/login",
        forgetPassword: "/api/v1/client/iam/auth/forgetPassword",
        userEditProfile: "/api/v1/client/iam/auth/userEditProfile",
        userGetInfo: "/api/v1/client/iam/auth/userGetInfo",
      },

      // DASHBOARD (user-panel)
      dashboard: {
        estate: {
          getSavedEstateList:
            "/api/v1/client/dashboard/estate/getSavedEstateList",
          getList: "/api/v1/client/dashboard/estate/getList",
          get: "/api/v1/client/dashboard/estate/get",

          toggleSave: "/api/v1/client/dashboard/estate/toggleSave",
          create: "/api/v1/client/dashboard/estate/create",

          edit: "/api/v1/client/dashboard/estate/edit",

          request: {
            getRequestList: "/api/v1/client/dashboard/estate/getRequestList",
            getRequest: "/api/v1/client/dashboard/estate/getRequest",

            createRequest: "/api/v1/client/dashboard/estate/createRequest",

            editRequest: "/api/v1/client/dashboard/estate/editRequest",
          },
        },

        owner: {
          getList: "/api/v1/client/dashboard/owner/getList",
          get: "/api/v1/client/dashboard/owner/get",

          create: "/api/v1/client/dashboard/owner/create",

          edit: "/api/v1/client/dashboard/owner/edit",

          getEstateList: "/api/v1/client/dashboard/owner/getEstateList", // ? id
        },
      },
    },

    // Add more endpoint groups here
  },
} as const;

// Helper function to build full URL
export function buildApiUrl(path: string): string {
  return `${API_CONFIG.baseURL}${path}`;
}

// Helper function to handle query parameters
export function buildQueryString(
  params: Record<string, string | number | undefined>,
): string {
  return Object.entries(params)
    .filter(([_, value]) => value)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");
}

// Helper function to build URL with query parameters
export function buildUrlWithQuery(
  path: string,
  params?: Record<string, string | number | undefined>,
): string {
  const queryString = params ? `?${buildQueryString(params)}` : "";
  return buildApiUrl(path) + queryString;
}

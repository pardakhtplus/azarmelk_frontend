# Notification System

This document describes the notification system implementation with API integration and real-time socket functionality.

## Components Created

### 1. API Integration

#### Endpoint Configuration

- **File**: `src/services/api-config.ts`
- **Endpoint**: `/api/v1/notification/getList`
- **Method**: GET
- **Parameters**:
  - `page?: number`
  - `limit?: number`
  - `isRead?: boolean`

#### API Service

- **File**: `src/services/axios-client.ts`
- Added `notification.getList()` method following the existing API pattern

#### Query Hooks

- **File**: `src/services/queries/client/notification/useNotificationList.ts`

  - Basic notification list query
  - Uses React Query for caching and automatic refetching
  - Refetches every 30 seconds
  - Considers data stale after 10 seconds

- **File**: `src/services/queries/client/notification/useNotificationListInfinite.ts`
  - Infinite scroll implementation using `useInfiniteQuery`
  - Loads 20 notifications per page by default
  - Automatic pagination with scroll detection
  - Optimized for large notification lists

#### Types

- **File**: `src/types/client/notification/types.ts`
- Defines `TNotification`, `TNotificationListResponse`, and `TGetNotificationListParams`

#### Local Storage Management

- **File**: `src/lib/notificationStorage.ts`
- Manages read/unread states in localStorage
- Features:
  - Mark individual notifications as read/unread
  - Bulk mark all as read
  - Automatic cleanup of old states (30 days)
  - Persistent across browser sessions
  - Error handling for localStorage issues

#### Mutations

- **File**: `src/services/mutations/client/notification/useMarkNotificationAsRead.ts`
  - Mutation for marking individual notifications as read
  - Updates local storage and invalidates queries
- **File**: `src/services/mutations/client/notification/useMarkAllNotificationsAsRead.ts`
  - Mutation for marking all notifications as read
  - Handles bulk operations efficiently

### 2. Components

#### NotificationCenter

- **File**: `src/components/modules/NotificationCenter.tsx`
- Main notification dropdown component
- Replaces the old `NotificationDropdown`
- Features:
  - Real-time socket integration
  - API data fetching with infinite scroll
  - Local storage for read/unread states
  - Mark as read functionality (individual and bulk)
  - Delete notifications
  - Responsive design
  - Loading states and pagination indicators
  - Automatic cleanup of old notification states

#### NotificationButton

- **File**: `src/components/modules/NotificationButton.tsx`
- Reusable notification button with badge
- Shows unread count
- Supports minimized state
- Responsive design

### 3. Socket Integration

#### Configuration

- **File**: `src/config/socket.ts`
- Defines socket events and configuration
- Environment variable: `NEXT_PUBLIC_SOCKET_URL`

#### Socket Events

**Client to Server:**

- `markNotificationAsRead` - Mark notification as read
- `deleteNotification` - Delete a notification

**Server to Client:**

- `newNotification` - Receive new notification
- `notificationRead` - Notification marked as read
- `notificationDeleted` - Notification deleted

#### Real-time Features

- Automatic connection on component mount
- Real-time notification updates
- Optimistic UI updates
- Query invalidation for data consistency

## Usage

### Basic Implementation

```tsx
import NotificationCenter from "@/components/modules/NotificationCenter";
import NotificationButton from "@/components/modules/NotificationButton";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerRefMobile = useRef<HTMLButtonElement>(null);

  return (
    <>
      <NotificationButton
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        isMinimized={false}
        isOpen={isOpen}
      />

      <NotificationCenter
        triggerRef={triggerRef}
        triggerRefMobile={triggerRefMobile}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

## Environment Variables

Add to your `.env` file:

```env
NEXT_PUBLIC_SOCKET_URL=ws://your-socket-server:port
```

## Server Requirements

The backend should implement:

1. **REST API Endpoint**: `GET /api/v1/notification/getList`

   - Returns paginated notifications
   - Supports filtering by read status

2. **Socket.IO Server** with the following events:
   - Listen for `markNotificationAsRead`
   - Listen for `deleteNotification`
   - Emit `newNotification` when new notifications are created
   - Emit `notificationRead` when notifications are marked as read
   - Emit `notificationDeleted` when notifications are deleted

## Dependencies Added

- `socket.io-client` - For real-time socket communication

## Migration Notes

The old `NotificationDropdown` component has been replaced with the new `NotificationCenter`. The new system:

1. Fetches real data from the API instead of using mock data
2. Provides real-time updates via WebSocket
3. Maintains the same UI/UX but with improved functionality
4. Supports both desktop and mobile layouts
5. Includes proper loading and error states

## Testing

To test the notification system:

1. Ensure the API endpoint `/api/v1/notification/getList` is available
2. Set up a Socket.IO server at the configured URL
3. The component will automatically connect and start receiving real-time updates
4. Test marking notifications as read and deleting them
5. Verify that new notifications appear in real-time when emitted from the server

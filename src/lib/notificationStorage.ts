// Local storage utility for managing notification read states

const STORAGE_KEY = "notification_read_states";

export interface NotificationReadState {
  [notificationId: string]: {
    isRead: boolean;
    readAt: string;
  };
}

export class NotificationStorage {
  private static getStoredStates(): NotificationReadState {
    if (typeof window === "undefined") return {};

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error(
        "Error reading notification states from localStorage:",
        error,
      );
      return {};
    }
  }

  private static saveStates(states: NotificationReadState): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
    } catch (error) {
      console.error("Error saving notification states to localStorage:", error);
    }
  }

  static markAsRead(notificationId: string): void {
    const states = this.getStoredStates();
    states[notificationId] = {
      isRead: true,
      readAt: new Date().toISOString(),
    };
    this.saveStates(states);

    // Dispatch custom event to notify components
    if (typeof window !== "undefined") {
      console.log(
        "NotificationStorage: Dispatching storage change event for markAsRead",
      );
      window.dispatchEvent(new CustomEvent("notificationStorageChange"));
    }
  }

  static markAsUnread(notificationId: string): void {
    const states = this.getStoredStates();
    if (states[notificationId]) {
      states[notificationId].isRead = false;
    }
    this.saveStates(states);
  }

  static isRead(notificationId: string): boolean {
    const states = this.getStoredStates();
    return states[notificationId]?.isRead || false;
  }

  static getReadState(
    notificationId: string,
  ): { isRead: boolean; readAt?: string } | null {
    const states = this.getStoredStates();
    return states[notificationId] || null;
  }

  static markAllAsRead(notificationIds: string[]): void {
    const states = this.getStoredStates();
    const now = new Date().toISOString();

    notificationIds.forEach((id) => {
      states[id] = {
        isRead: true,
        readAt: now,
      };
    });

    this.saveStates(states);

    // Dispatch custom event to notify components
    if (typeof window !== "undefined") {
      console.log(
        "NotificationStorage: Dispatching storage change event for markAllAsRead",
      );
      window.dispatchEvent(new CustomEvent("notificationStorageChange"));
    }
  }

  static clearOldStates(daysToKeep: number = 30): void {
    const states = this.getStoredStates();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const filteredStates: NotificationReadState = {};

    Object.entries(states).forEach(([id, state]) => {
      if (state.readAt && new Date(state.readAt) > cutoffDate) {
        filteredStates[id] = state;
      }
    });

    this.saveStates(filteredStates);
  }

  static getAllReadStates(): NotificationReadState {
    return this.getStoredStates();
  }

  static clearAllStates(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

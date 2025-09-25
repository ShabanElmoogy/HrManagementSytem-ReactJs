import { signalRService } from "@/shared";

interface Country {
  id: number;
  nameAr?: string;
  nameEn?: string;
  code?: string;
  isActive?: boolean;
}

interface CountryUpdateData {
  count?: number;
  country: Country;
  action: string;
  message?: string | null;
}

interface NotificationSystem {
  addNotification: (
    message: string,
    type: string,
    metadata?: {
      entityType: string;
      category: string;
      data: Country;
      count?: number;
    }
  ) => void;
}

type ActionType = "created" | "updated" | "deleted";
type NotificationType = "success" | "info" | "warning";

class CountryHandler {
  private notificationSystem: NotificationSystem | null;
  private readonly entityType: string;

  constructor() {
    this.notificationSystem = null;
    this.entityType = "country";
  }

  initialize(notificationSystem: NotificationSystem): void {
    this.notificationSystem = notificationSystem;
    this.setupSignalR();
  }

  private setupSignalR(): void {
    signalRService.off("ReceiveCountryUpdate");

    signalRService.on("ReceiveCountryUpdate", (data: CountryUpdateData) => {
      console.log("Received country update:", data);
      this.handleUpdate(data);
    });
  }

  private handleUpdate(data: CountryUpdateData): void {
    // Destructure all data from backend
    const { count, country, action, message: customMessage = null } = data;

    // Destructure entity fields
    const {
      nameAr = "",
      nameEn = "",
    } = country;

    const name = nameAr || nameEn || "Unknown";
    const message = customMessage || this.getMessage(name, action, count);
    const type = this.getType(action);

    if (this.notificationSystem) {
      this.notificationSystem.addNotification(message, type, {
        entityType: this.entityType,
        category: action,
        data: country,
        count,
      });
    }
  }

  private getMessage(name: string, action: string, count?: number): string {
    const countText = count ? ` (Total: ${count})` : "";
    const messages: Record<string, string> = {
      created: `New country "${name}" has been added${countText}`,
      updated: `Country "${name}" has been updated${countText}`,
      deleted: `Country "${name}" has been deleted${countText}`,
    };
    return messages[action] || `Country "${name}" ${action}${countText}`;
  }

  private getType(action: string): NotificationType {
    const actionTypes: Record<string, NotificationType> = {
      created: "success",
      updated: "info",
      deleted: "warning"
    };
    return actionTypes[action] || "info";
  }

  destroy(): void {
    signalRService.off("ReceiveCountryUpdate");
  }
}

export default new CountryHandler();

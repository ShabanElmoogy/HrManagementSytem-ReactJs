import { signalRService } from "@/shared";

class CountryHandler {
  constructor() {
    this.notificationSystem = null;
    this.entityType = "country";
  }

  initialize(notificationSystem) {
    this.notificationSystem = notificationSystem;
    this.setupSignalR();
  }

  setupSignalR() {
    signalRService.off("ReceiveCountryUpdate");

    signalRService.on("ReceiveCountryUpdate", (data) => {
      console.log("Received country update:", data);
      this.handleUpdate(data);
    });
  }

  handleUpdate(data) {
    // Destructure all data from backend
    const { count, country, action, message: customMessage = null } = data;

    // Destructure entity fields
    const {
      id,
      nameAr = "",
      nameEn = "",
      code = "",
      isActive = true,
    } = country;

    const name = nameAr || nameEn || "Unknown";
    const message = customMessage || this.getMessage(name, action, count);
    const type = this.getType(action);

    this.notificationSystem.addNotification(message, type, {
      entityType: this.entityType,
      category: action,
      data: country,
      count,
    });
  }

  getMessage(name, action, count) {
    const countText = count ? ` (Total: ${count})` : "";
    const messages = {
      created: `New country "${name}" has been added${countText}`,
      updated: `Country "${name}" has been updated${countText}`,
      deleted: `Country "${name}" has been deleted${countText}`,
    };
    return messages[action] || `Country "${name}" ${action}${countText}`;
  }

  getType(action) {
    return (
      { created: "success", updated: "info", deleted: "warning" }[action] ||
      "info"
    );
  }

  destroy() {
    signalRService.off("ReceiveCountryUpdate");
  }
}

export default new CountryHandler();

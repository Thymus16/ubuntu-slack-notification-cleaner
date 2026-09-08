import * as Main from "resource:///org/gnome/shell/ui/main.js";
import {Extension} from "resource:///org/gnome/shell/extensions/extension.js";
import Shell from "gi://Shell";
import {NotificationApplicationPolicy} from "resource:///org/gnome/shell/ui/messageTray.js";

import {
  getWindowIdentifiers,
  isSlackWindow,
  sourceMatchesSlack,
} from "./matching.js";

export default class UbuntuSlackNotificationCleaner extends Extension {
  _focusListenerId = null;
  _windowTracker = Shell.WindowTracker.get_default();

  _clearSlackNotifications(window) {
    const app = this._windowTracker.get_window_app(window);
    if (!app || !isSlackWindow(app, window))
      return;

    const windowIdentifiers = getWindowIdentifiers(app, window);

    for (const source of Main.messageTray.getSources()) {
      const policyId = source.policy instanceof NotificationApplicationPolicy
        ? source.policy.id
        : null;
      const icon = source.icon?.to_string() ?? null;

      if (!sourceMatchesSlack({policyId, icon, title: source.title}, windowIdentifiers))
        continue;

      for (const notification of [...source.notifications]) {
        if (!notification.isTransient)
          notification.destroy();
      }
    }
  }

  enable() {
    this._focusListenerId = global.display.connect(
      "notify::focus-window",
      display => {
        if (display.focusWindow)
          this._clearSlackNotifications(display.focusWindow);
      },
    );
  }

  disable() {
    if (this._focusListenerId !== null) {
      global.display.disconnect(this._focusListenerId);
      this._focusListenerId = null;
    }
  }
}

# Ubuntu Slack Notification Cleaner

GNOME Shell 50 extension for Ubuntu 26.04 that removes persistent Slack desktop notifications when a Slack window gains focus (based on a minimal fork of [Junk Notification Cleaner](https://github.com/murar8/junk-notification-cleaner)).
Notifications remain present while Slack is unfocused. Focusing a Slack window removes Slack's persistent notifications and badges.

Why Slack? Slack's Linux client leaves desktop notifications and badges until manually cleared. Apparently handling the notification lifecycle in a communication app was considered an extra. I mean, why would you expect notifications to be a core Slack feature?

## Install

```bash
curl -fL https://github.com/Thymus16/ubuntu-slack-notification-cleaner/releases/latest/download/ubuntu-slack-notification-cleaner%40thymus16.github.io.shell-extension.zip -o ubuntu-slack-notification-cleaner.zip
gnome-extensions install --force ubuntu-slack-notification-cleaner.zip
gnome-extensions enable ubuntu-slack-notification-cleaner@thymus16.github.io
```

If GNOME does not discover a newly installed extension immediately under Wayland, log out and back in, then run the enable command again.

## Manual build

```bash
git clone https://github.com/Thymus16/ubuntu-slack-notification-cleaner.git
cd ubuntu-slack-notification-cleaner
make check
make install
```

## Remove

```bash
gnome-extensions uninstall ubuntu-slack-notification-cleaner@thymus16.github.io
```

## Behavior and limitations

- Focusing any Slack window clears all persistent Slack notifications, even if some messages have not been individually opened.
- A notification received while Slack remains focused is cleared the next time focus leaves and returns to Slack.
- The extension uses GNOME Shell's internal notification objects because the standard desktop notification API cannot enumerate another application's notifications. A future GNOME Shell release may require an update.

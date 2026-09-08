# Security review

## Audited upstream revision

- Repository: `murar8/junk-notification-cleaner`
- Commit: `aa3db991997249a5fe251acd41c8c09a88fcd01c`
- Commit date: 2026-05-16
- License: MIT

## Findings

No malicious behavior was found in the audited revision.

The audited upstream runtime:

- subscribes to GNOME Shell focus and window-destroy events;
- reads focused-window identifiers and in-memory notification sources;
- destroys matching persistent notification objects;
- reads and writes only its own GNOME settings;
- does not access the network, filesystem, clipboard, keyring, credentials, sockets, or external processes;
- does not execute shell commands or dynamic code.

The upstream preferences process enumerates installed desktop applications so the user can configure exclusions. Its optional diagnostic logging can write window identifiers, source identifiers, and notification titles to the GNOME Shell journal. The default behavior affects all applications except those explicitly excluded.

The upstream TypeScript build uses npm development dependencies. They are not part of the installed GNOME extension, but installing them adds ordinary JavaScript supply-chain exposure and invokes the repository's Husky prepare script.

## Slack-only changes

This derived extension contains no third-party or npm runtime dependencies. It removes the preferences UI, settings schema, close-window listener, diagnostic logging, application enumeration, and broad title heuristics. Cleanup runs only after the focused window is identified as Slack and only for notification sources identified as Slack.

GNOME Shell extensions execute inside the desktop shell process. A defect can therefore disrupt the shell session. This review establishes that no suspicious capability or behavior was found; it is not a formal security proof.

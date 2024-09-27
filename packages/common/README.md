# ub-common

Common components/features for Ultimate Blocks.

## ❓Why

Since `Ultimate Blocks` is divided into two sources as `base` and `pro` versions, keeping common components and
functionality synced between those two code bases became problematic. This package provide that shared functionality
across these code bases.

## ⚙️ Usage

`dist` folder hosts the final code to use in `Ultimate Blocks`. Delete the previous version entirely at `base`/`pro`
version of the `Ultimate Blocks` source code and paste the folder.

## 📦 Contents

### Components

- #### IconControl
  Icon selection control for block inspector panel.
- #### UbIconComponent
  Icon component to render provided icons to editor and client view.
- #### IconPanelGroup
  Gutenberg inspector panel control group for icon component.
- #### IconSizePicker
  Icon size control.
- #### PortalBase
  Portal component to render its children to target element on DOM.
- #### BlackWhiteButtonGroup
  Button group for BlackWhiteButton.
- #### BlackWhiteButton
  Black and white styled button.

### Inc

- #### Debouncer
  Event bouncer to delay specific tasks to improve performance.
- #### IconSizeDefinition
  Icon size definition generator for icon panel group.
- #### createNamespacedHelpers
  Generate select and dispatch helpers based on target Gutenberg data store.
- #### connectWithStore
  HOC for connecting Gutenberg data stores.
- #### ManagerBase
  Abstract class for manager implementations.
- #### FrontendDataManager
  Data manager for frontend operations.
- #### HookManager
  Manager responsible for plugin wide messaging and filtering operations.
- #### hookTypes
  Common hooks used throughout plugin.
- #### withHookManager
  HOC for connection to hook manager.
- #### registerPreviewManager
  Register preview manager block for Gutenberg.

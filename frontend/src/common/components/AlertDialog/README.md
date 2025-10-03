# AlertDialog

Lightweight, modern alert/notification dialog using TailwindCSS. Default theme: emerald (green). Error theme: red.

## Simple props
- message: string
- type?: 'error' | 'noti' (default 'noti')
- durationMs?: number (default 3000)
- onClose?: () => void

```tsx
import AlertDialog from '../../common/components/AlertDialog';

// Show once on mount
<AlertDialog message="Saved successfully!" type="noti" />
```

## Controlled/base variant

```tsx
import { AlertDialogBase } from '../../common/components/AlertDialog';

<AlertDialogBase open onClose={() => {}} message="Hello" type="error" />
```

## Hook usage

```tsx
import React from 'react';
import { useAlert } from '../../common/components/AlertDialog/useAlert';

export const Demo: React.FC = () => {
  const { notify, error, AlertHost } = useAlert();

  return (
    <div>
      <button onClick={() => notify('Saved successfully!')}>Notify</button>
      <button onClick={() => error('Something went wrong')}>Error</button>
      <AlertHost />
    </div>
  );
};
```

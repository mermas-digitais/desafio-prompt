import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function AccessibleDialog({ open, title, onClose, children }: {
  open: boolean; title: string; onClose: () => void; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const trigger = document.activeElement as HTMLElement | null;
    dialog.showModal();
    return () => { dialog.close(); if (trigger?.isConnected) trigger.focus(); };
  }, [open]);
  return (
    <dialog ref={ref} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')].filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }}
      className="org-dialog org-surface [&_button]:min-h-11 [&_input]:min-h-11 [&_select]:min-h-11">
      <div className="org-dialog-header">
        <h2 id={titleId} className="font-display text-xl break-words min-w-0">{title}</h2>
        <button type="button" onClick={onClose} aria-label={`Fechar: ${title}`} className="org-button org-button-quiet shrink-0 !p-2.5"><X className="w-5 h-5" aria-hidden="true" /></button>
      </div>
      <div className="org-dialog-body">{open && children}</div>
    </dialog>
  );
}

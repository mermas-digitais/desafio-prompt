import { useEffect, useId, useRef, type ReactNode } from 'react';

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
      className="m-auto w-[calc(100%-2rem)] max-w-lg max-h-[90dvh] overflow-y-auto rounded-3xl border border-[#DDC7F8] bg-white p-6 text-[#330043] shadow-2xl backdrop:bg-black/60 [&_button]:min-h-11 [&_input]:min-h-11 [&_select]:min-h-11 [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#9747FF]">
      <div className="flex items-start justify-between gap-4 mb-5">
        <h2 id={titleId} className="font-display text-xl break-words">{title}</h2>
        <button type="button" onClick={onClose} className="px-3 rounded-xl border border-[#DDC7F8] text-sm">Fechar</button>
      </div>
      {open && children}
    </dialog>
  );
}

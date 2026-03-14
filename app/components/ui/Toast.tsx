import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onDone: () => void;
}

export function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 z-50 text-sm font-mono px-4 py-3 rounded-xl animate-fade-up"
      style={{ background: 'var(--green)', color: '#000' }}>
      {message}
    </div>
  );
}

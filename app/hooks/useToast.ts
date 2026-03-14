'use client';

import { useState, useCallback } from 'react';

export function useToast() {
  const [message, setMessage] = useState('');

  const show = useCallback((msg: string, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  }, []);

  const clear = useCallback(() => setMessage(''), []);

  return { message, show, clear };
}

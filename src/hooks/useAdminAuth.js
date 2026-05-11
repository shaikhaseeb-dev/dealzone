'use client';
import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch('/api/admin/check')
      .then((r) => r.json())
      .then((d) => {
        setIsAdmin(!!d.isAdmin);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, []);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAdmin(false);
    window.location.href = '/';
  };

  return { isAdmin, checked, logout };
}

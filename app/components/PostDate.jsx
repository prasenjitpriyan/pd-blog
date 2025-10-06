'use client';

import { useEffect, useState } from 'react';

export default function PostDate({ dateString }) {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Date(dateString).toLocaleDateString());
  }, [dateString]);
  return <>{date}</>;
}

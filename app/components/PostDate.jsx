// app/components/PostDate.jsx
'use client';

import { useEffect, useState } from 'react';

export default function PostDate({ dateString }) {
  const [date, setDate] = useState('');

  useEffect(() => {
    // The 'useEffect' hook runs only on the client, after the component has mounted.
    // This is the perfect place to use browser-specific APIs like `toLocaleDateString`.
    setDate(new Date(dateString).toLocaleDateString());
  }, [dateString]); // Re-run effect if dateString changes

  // On initial render (both server and client), this will return null.
  // After mounting on the client, the useEffect will run and update the state,
  // causing a re-render with the formatted date.
  return <>{date}</>;
}

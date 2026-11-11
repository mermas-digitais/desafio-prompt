import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './client/router';

export function App() {
  return <RouterProvider router={router} />;
}

export default App;

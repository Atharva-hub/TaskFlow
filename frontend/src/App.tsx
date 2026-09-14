import { useEffect, useState } from 'react';
import { apiRequest } from './api/client';

interface HealthResponse {
  status: string;
}

function App() {
  const [status, setStatus] = useState<string>('checking...');

  useEffect(() => {
    apiRequest<HealthResponse>('/health')
      .then((res) => setStatus(res.status))
      .catch(() => setStatus('unreachable'));
  }, []);

  return (
    <div>
      <h1>TaskFlow</h1>
      <p>API status: {status}</p>
    </div>
  );
}

export default App;
import React, { ReactNode, useEffect, useState } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';

export default function LogDashboard(): ReactNode {
  const [logs, setLogs] = useState<{ tenant: string; message: string }[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9001');
    ws.onmessage = (e) => {
      const parsed = JSON.parse(e.data);
      setLogs((prev) => [...prev.slice(-100), parsed]);
      console.log(`Received log: ${parsed.message}`, {
        tenant: parsed.tenant,
      });
    };
    return () => ws.close();
  }, []);

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.heroText}>📺 Abimongo Log Stream</h2>
      <p className={styles.content}>
        {/* This is a live stream of logs from the Abimongo server.
        <br />
        <br />
        <strong>Note:</strong> This is a demo dashboard. The logs are not stored
        anywhere and will be lost when the page is refreshed.

        <br />
        <br />
        <strong>Tip:</strong> You can use the browser's developer tools to inspect
        the WebSocket connection and see the raw log messages. */}
      </p>
      <p className={styles.content}>
        <strong>Abinod Design:</strong> Reatime log stream from Abimongo server.
      </p>
      {logs.map((log, i) => (
        <div key={i}>
          <span style={{ color: '#ff0' }}>[{log.tenant}]</span> {log.message}
        </div>
      ))}
    </div>
  );
}

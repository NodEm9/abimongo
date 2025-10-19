// import { clearAllTimers } from '../utils/TimerRegistry';
// import { MetricsTracker } from '../utils/MetricsTracker';


// const activeTransports: any[] = []; // This should be replaced with the actual transport instances

// /**
//  * Gracefully stops all loggers, timers, and background tasks
//  */
//  async function shutdownLogger() {
// 	const metricsTracker = new MetricsTracker();
//   // Stop metrics tracking (synchronously)
//   metricsTracker.stop?.();

//   // Await flushing of any remaining log data
//   await Promise.all(
//     activeTransports
//       .filter(t => typeof t.flush === 'function')
//       .map(t => t.flush())
//   );

//   // Stop flusher intervals
//   for (const transport of activeTransports) {
//     if (typeof transport.stop === 'function') {
//       transport.stop();
//     }
//   }

//   // Kill all remaining tracked timers
//   await clearAllTimers();
// }

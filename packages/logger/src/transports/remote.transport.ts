import axios from 'axios';
import { createCircuitBreaker, retryWithBackoff } from "../utils";
import { RemoteTransporter } from "../types";

/**
 * Creates an HTTP remote transporter that sends log messages to a specified URL via HTTP POST requests.
 * @param url The endpoint URL to which log messages will be sent.
 * @returns A RemoteTransporter function that sends log messages to the specified URL.
 */
export const createHttpTransport = (url: string): RemoteTransporter => {
  return async (message, meta) => {
    await axios.post(url, {
      timestamp: new Date().toISOString(),
      level: meta.level,
      message,
      ...meta.meta
    });
  };
}

/**
 * Creates an ElasticSearch transporter that sends log messages to a specified ElasticSearch index.
 * @param url The base URL of the ElasticSearch server.
 * @param index The index name where log messages will be stored.
 *  @returns A RemoteTransporter function that sends log messages to the specified ElasticSearch index.
 */
export function createElasticTransport
  (url: string, index: string): RemoteTransporter {
  return async (message, meta) => {
    await axios.post(`${url}/${index}/_doc`, {
      timestamp: new Date().toISOString(),
      level: meta.level,
      message,
      ...meta.meta
    });
  };
}

/**
 * Creates a Loki transporter that sends log messages to a specified Loki push URL with given labels.
 * @param pushUrl The Loki push endpoint URL.
 * @param labels A record of labels to attach to the log streams.
 * @returns A RemoteTransporter function that sends log messages to the specified Loki push URL.
 */
export function createLokiTransport
  (
    pushUrl: string,
    labels: Record<string, string>
  ): RemoteTransporter {
  return async (message, meta) => {
    await axios.post(pushUrl, {
      streams: [
        {
          stream: labels,
          values: [[`${Date.now()}000000`, message, meta.message]],
        }
      ],
      level: meta.level,
    });
  };
};

/**
 * Wraps a base RemoteTransporter with resilience features such as retries and circuit breaking.
 * @param baseTransporter The base RemoteTransporter to be wrapped.
 * @returns A resilient RemoteTransporter with retry and circuit breaker capabilities.
 */
export function createResilientTransporter(baseTransporter: RemoteTransporter): RemoteTransporter {
  const breakerWrapped = createCircuitBreaker(baseTransporter);

  return async (formattedMessage, meta) => {
    await retryWithBackoff(() => breakerWrapped(formattedMessage, meta));
  };
};

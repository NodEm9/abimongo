import React from 'react';
import type { Metric } from './types';
import styles from './dashboard.module.css';

type Props = {
	metric: Metric;
	loading?: boolean;
	error?: string | null;
};

export const MetricCard: React.FC<Props> = ({ metric, loading, error }) => {
	if (loading) {
		return (
			<div className={styles.metricCard} aria-busy="true">
				<div className={styles.metricLabel}>Loading…</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.metricCard} role="alert">
				<div className={styles.metricLabel}>Error</div>
				<div className={styles.metricValue}>{error}</div>
			</div>
		);
	}

	const delta = metric.delta;
	const deltaClass = delta === undefined ? '' : delta > 0 ? styles.deltaUp : styles.deltaDown;

	return (
		<div className={styles.metricCard} aria-labelledby={`metric-${metric.id}`}>
			<div id={`metric-${metric.id}`} className={styles.metricLabel} title={metric.description || ''}>
				{metric.label}
			</div>
			<div className={styles.metricValue}>
				{
					(() => {
						if (typeof metric.value === 'number') return new Intl.NumberFormat().format(metric.value);
						if (typeof metric.value === 'string') {
							// If this looks like an ISO timestamp, format it nicely for humans
							const maybeDate = new Date(metric.value);
							if (!Number.isNaN(maybeDate.getTime()) && metric.value.includes('T')) {
								return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(maybeDate);
							}
							return metric.value;
						}
						return String(metric.value ?? '');
					})()
				}
				{metric.unit ? ` ${metric.unit}` : ''}
			</div>
			{delta !== undefined && <div className={deltaClass}>{delta > 0 ? `▲ ${delta}` : `▼ ${Math.abs(delta)}`}</div>}
		</div>
	);
};

export default MetricCard;

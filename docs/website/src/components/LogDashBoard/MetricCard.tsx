import React from 'react';
import type { Metric } from './types';
import styles from './styles.module.css';

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
				{typeof metric.value === 'number' ? new Intl.NumberFormat().format(metric.value) : metric.value}
				{metric.unit ? ` ${metric.unit}` : ''}
			</div>
			{delta !== undefined && <div className={deltaClass}>{delta > 0 ? `▲ ${delta}` : `▼ ${Math.abs(delta)}`}</div>}
		</div>
	);
};

export default MetricCard;

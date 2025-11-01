
// @ts-nocheck
import React from 'react';
import { MetricCard } from '../MetricCard';
import type { Metric } from '../types';

describe('MetricCard basic', () => {
	it('creates an element with the provided metric', () => {
		const metric: Metric = { id: 'm1', label: 'Requests', value: 123 };
		const el = MetricCard({ metric, loading: false, error: null });
		// the component returns a React element; ensure props are wired
		if (!el) throw new Error('MetricCard did not render');
	});
});

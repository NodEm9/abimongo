export interface Metric {
	id: string;
	label: string;
	value: number | string;
	unit?: string;
	delta?: number;
	description?: string;
}

# Class: MetricsTracker

Defined in: utils/MetricsTracker.ts:23

## Constructors

### Constructor

> **new MetricsTracker**(): `MetricsTracker`

#### Returns

`MetricsTracker`

## Methods

### getSnapshot()

> **getSnapshot**(): [`MetricsSnapshot`](../interfaces/MetricsSnapshot.md)

Defined in: utils/MetricsTracker.ts:67

#### Returns

[`MetricsSnapshot`](../interfaces/MetricsSnapshot.md)

***

### isTrackingMetrics()

> **isTrackingMetrics**(): `boolean`

Defined in: utils/MetricsTracker.ts:77

#### Returns

`boolean`

***

### start()

> **start**(`interval`): `void`

Defined in: utils/MetricsTracker.ts:42

#### Parameters

##### interval

`number` = `60_000`

#### Returns

`void`

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: utils/MetricsTracker.ts:52

#### Returns

`Promise`\<`void`\>

***

### trackFlush()

> **trackFlush**(): `void`

Defined in: utils/MetricsTracker.ts:34

#### Returns

`void`

***

### trackLog()

> **trackLog**(): `void`

Defined in: utils/MetricsTracker.ts:30

#### Returns

`void`

***

### trackRotation()

> **trackRotation**(): `void`

Defined in: utils/MetricsTracker.ts:38

#### Returns

`void`

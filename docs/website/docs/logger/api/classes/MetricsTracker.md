[**@abimongo/logger**](../README.md)

***

# Class: MetricsTracker

Defined in: [utils/MetricsTracker.ts:23](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/utils/MetricsTracker.ts#L23)

## Constructors

### Constructor

> **new MetricsTracker**(): `MetricsTracker`

Defined in: [utils/MetricsTracker.ts:31](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/utils/MetricsTracker.ts#L31)

#### Returns

`MetricsTracker`

## Properties

### instance

> `static` **instance**: `MetricsTracker`

Defined in: [utils/MetricsTracker.ts:29](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/utils/MetricsTracker.ts#L29)

## Methods

### getSnapshot()

> **getSnapshot**(): [`MetricsSnapshot`](../interfaces/MetricsSnapshot.md)

Defined in: [utils/MetricsTracker.ts:74](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/utils/MetricsTracker.ts#L74)

#### Returns

[`MetricsSnapshot`](../interfaces/MetricsSnapshot.md)

***

### isTrackingMetrics()

> **isTrackingMetrics**(): `boolean`

Defined in: [utils/MetricsTracker.ts:84](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/utils/MetricsTracker.ts#L84)

#### Returns

`boolean`

***

### start()

> **start**(`interval`): `void`

Defined in: [utils/MetricsTracker.ts:49](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/utils/MetricsTracker.ts#L49)

#### Parameters

##### interval

`number` = `60_000`

#### Returns

`void`

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [utils/MetricsTracker.ts:59](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/utils/MetricsTracker.ts#L59)

#### Returns

`Promise`\<`void`\>

***

### trackFlush()

> **trackFlush**(): `void`

Defined in: [utils/MetricsTracker.ts:41](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/utils/MetricsTracker.ts#L41)

#### Returns

`void`

***

### trackLog()

> **trackLog**(): `void`

Defined in: [utils/MetricsTracker.ts:37](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/utils/MetricsTracker.ts#L37)

#### Returns

`void`

***

### trackRotation()

> **trackRotation**(): `void`

Defined in: [utils/MetricsTracker.ts:45](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/utils/MetricsTracker.ts#L45)

#### Returns

`void`

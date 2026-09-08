import cron from 'node-cron';
import { scheduleGarbageCollector, runGarbageCollectorOnAllModels  } from '../../gc';
import { AbimongoModelRegistry } from '../../utils';


jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

jest.mock('../../utils/ModelRegistry', () => ({
  AbimongoModelRegistry: {
    getAllModels: jest.fn(),
  },
}));

jest.mock('../../gc/gcManager', () => ({
  runGarbageCollectorOnAllModels: jest.fn(),
}));

describe('scheduleGarbageCollector', () => {
  let cronCallback: (() => Promise<void>) | undefined;

  beforeEach(() => {
    jest.clearAllMocks();

    (cron.schedule as jest.Mock).mockImplementation(
      (_expr: string, cb: () => Promise<void>) => {
        cronCallback = cb;
        return {} as any;
      }
    );

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should schedule the garbage collector with the provided cron expression', () => {
    scheduleGarbageCollector('0 * * * *');

    expect(cron.schedule).toHaveBeenCalledWith(
      '0 * * * *',
      expect.any(Function)
    );
  });

  it('should use the default cron expression when none is provided', () => {
    scheduleGarbageCollector();

    expect(cron.schedule).toHaveBeenCalledWith(
      '0 * * * *',
      expect.any(Function)
    );
  });

  it('should run garbage collector for models with valid context and collectionName', async () => {
    const mockModel = {
      getContext: jest.fn().mockReturnValue({
        ctx: { collectionName: 'users' },
      }),
    };

    (AbimongoModelRegistry.getAllModels as jest.Mock).mockReturnValue([mockModel]);
    (runGarbageCollectorOnAllModels as jest.Mock).mockResolvedValue(undefined);

    scheduleGarbageCollector('*/5 * * * *');

    expect(cronCallback).toBeDefined();
    await cronCallback!();

    expect(AbimongoModelRegistry.getAllModels).toHaveBeenCalled();
    expect(mockModel.getContext).toHaveBeenCalled();
    expect(runGarbageCollectorOnAllModels).toHaveBeenCalled();
  });

  it('should skip models without valid context', async () => {
    const invalidModel = {
      getContext: jest.fn().mockReturnValue(undefined),
    };

    (AbimongoModelRegistry.getAllModels as jest.Mock).mockReturnValue([invalidModel]);

    scheduleGarbageCollector();

    await cronCallback!();

    expect(runGarbageCollectorOnAllModels).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });

  it('should skip models without ctx.collectionName', async () => {
    const invalidModel = {
      getContext: jest.fn().mockReturnValue({
        ctx: {},
      }),
    };

    (AbimongoModelRegistry.getAllModels as jest.Mock).mockReturnValue([invalidModel]);

    scheduleGarbageCollector();

    await cronCallback!();

    expect(runGarbageCollectorOnAllModels).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });

  it('should log an error when garbage collector execution fails', async () => {
    const mockModel = {
      getContext: jest.fn().mockReturnValue({
        ctx: { collectionName: 'users' },
      }),
    };

    const error = new Error('GC failed');

    (AbimongoModelRegistry.getAllModels as jest.Mock).mockReturnValue([mockModel]);
    (runGarbageCollectorOnAllModels as jest.Mock).mockRejectedValue(error);

    scheduleGarbageCollector();

    await cronCallback!();

    expect(runGarbageCollectorOnAllModels).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('should process multiple models', async () => {
    const modelA = {
      getContext: jest.fn().mockReturnValue({
        ctx: { collectionName: 'users' },
      }),
    };

    const modelB = {
      getContext: jest.fn().mockReturnValue({
        ctx: { collectionName: 'orders' },
      }),
    };

    (AbimongoModelRegistry.getAllModels as jest.Mock).mockReturnValue([modelA, modelB]);
    (runGarbageCollectorOnAllModels as jest.Mock).mockResolvedValue(undefined);

    scheduleGarbageCollector();

    await cronCallback!();

    expect(modelA.getContext).toHaveBeenCalled();
    expect(modelB.getContext).toHaveBeenCalled();
    expect(runGarbageCollectorOnAllModels).toHaveBeenCalledTimes(1);
  });
});
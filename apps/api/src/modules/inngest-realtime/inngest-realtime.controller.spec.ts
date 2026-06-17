import { getSubscriptionToken } from '@inngest/realtime';
import { UnauthorizedException } from '@nestjs/common';

import { InngestRealtimeController } from './inngest-realtime.controller';

jest.mock('@inngest/realtime', () => ({
  getSubscriptionToken: jest.fn(),
}));

jest.mock('@/lib/inngest/client', () => ({ inngest: {} }));

jest.mock('@/lib/inngest/channels/http-request', () => ({
  httpRequestChannel: (userId: string) => ({ name: `http-request:${userId}` }),
}));

jest.mock('@/lib/inngest/channels/manual', () => ({
  manualChannel: (userId: string) => ({
    name: `manual-trigger:${userId}`,
  }),
}));

describe('InngestRealtimeController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('mints a token for the http-request status channel', async () => {
    const mockGetSubscriptionToken =
      getSubscriptionToken as jest.MockedFunction<typeof getSubscriptionToken>;
    const token = {
      channel: 'http-request',
      topics: ['status'],
      key: 'token-key',
    };
    mockGetSubscriptionToken.mockResolvedValue(token);

    const controller = new InngestRealtimeController();
    await expect(controller.getHttpRequestStatusToken('user-1')).resolves.toBe(
      token,
    );

    const [, options] = mockGetSubscriptionToken.mock.calls[0];
    expect(options.topics).toEqual(['status']);
    expect(options.channel).toMatchObject({
      name: 'http-request:user-1',
    });
  });

  it('rejects unauthenticated requests', async () => {
    const controller = new InngestRealtimeController();

    await expect(
      controller.getHttpRequestStatusToken(undefined),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('mints a token for the manual-trigger status channel', async () => {
    const mockGetSubscriptionToken =
      getSubscriptionToken as jest.MockedFunction<typeof getSubscriptionToken>;
    const token = {
      channel: 'manual-trigger',
      topics: ['status'],
      key: 'token-key',
    };
    mockGetSubscriptionToken.mockResolvedValue(token);

    const controller = new InngestRealtimeController();
    await expect(
      controller.getManualTriggerStatusToken('user-1'),
    ).resolves.toBe(token);

    const [, options] = mockGetSubscriptionToken.mock.calls[0];
    expect(options.topics).toEqual(['status']);
    expect(options.channel).toMatchObject({
      name: 'manual-trigger:user-1',
    });
  });

  it('rejects unauthenticated manual-trigger requests', async () => {
    const controller = new InngestRealtimeController();

    await expect(
      controller.getManualTriggerStatusToken(undefined),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

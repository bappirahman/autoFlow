import { getSubscriptionToken } from '@inngest/realtime';
import { UnauthorizedException } from '@nestjs/common';

import { InngestRealtimeController } from './inngest-realtime.controller';

jest.mock('@inngest/realtime', () => ({
  getSubscriptionToken: jest.fn(),
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
});

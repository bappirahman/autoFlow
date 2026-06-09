import type { INestApplication } from '@nestjs/common';

let _app: INestApplication;

export const setApp = (app: INestApplication) => {
  _app = app;
};

export const getApp = (): INestApplication => _app;

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() { }

  async getHello() {
    return 'Hello World!';
  }

}

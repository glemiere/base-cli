/*
  Example:
  import * as Error from './error'
  new Error.Handler(Error.CMD_NOT_FND, details, true)
  ew Error.Handler(Error.CMD_NOT_FND, details)
*/

import logger from '../logger';

export * from "./errorMessages";

export class Handler {
  private static isVerbose: boolean;

  constructor(
    private msg       ?: string,
    private details   ?: any,
    private isFatale  : boolean = false,
  ) {
    if (msg)
      this.handleError();
  }

  public init(isVerbose: boolean): void {
    Handler.isVerbose = isVerbose;
  }

  private handleError(): void {
    logger.error(`Error: ${this.msg}`);

    if (this.details && Handler.isVerbose)
      logger.error(`Error: ${this.details}`)

    if (this.isFatale) 
      process.exit();
  }
}

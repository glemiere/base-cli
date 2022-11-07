import * as Error from "./error";
import logger from "./logger";
import { CommandDescription } from '../interfaces/command.interface';

import {
  Info
} from "./commands";

export default class Cli {
  public options: Array<CommandDescription>;
  public info: Info;

  constructor(
    public args: string[],
  ) {
    this.args     = args;
    this.options  = new Array();
    this.info     = new Info();
  }

  public async init(): Promise<void> {
    this.options.push(
      {cmdStr: `help`, exec: this.help.bind(this)},
      {cmdStr: `info`, exec: this.info.exec.bind(this.info), subs:[
        {cmdStr: `egg`, exec: this.egg.bind(this)},
      ]},
    );

    const isVerbose = this.args.indexOf("--verbose") != -1;
    new Error.Handler().init(isVerbose ? true : false);
  }

  public async exec(args: Array<string>): Promise<void> {
    const command = this._getCommand(args, this.options);

    if (command)
      await command.exec();
    
    else if (args.length > 0)
      new Error.Handler(Error.Messages.CMD_NOT_FND, null, true);

    process.exit();
  }

  private _getCommand(args: Array<string>, commands: Array<CommandDescription>) :CommandDescription {
    let command :CommandDescription;
    
    commands.forEach((cmd:CommandDescription) => {
      if (cmd.cmdStr === args[0] && !args[1])
        command = cmd;

      if (cmd.cmdStr === args[0] && args[1]) {
        args.shift();
        command = this._getCommand(args, cmd.subs);
      }
    });

    return command;
  }

  public async welcome(): Promise<void> {
    const pkg     = require("../../package.json");
    const name    = pkg.name;
    const version = pkg.version;

    logger.log(`🔥 Currently using ${name} V${version} 🔥`);
    logger.log(`---------------------------------------`);
  }

  public async help(): Promise<void> {
    logger.info(`Usage: basecli [option].`);
    logger.log(`Available options:`);

    for (const opt of this.options)
      logger.log(`* ${opt.cmdStr}`);
  }

  public async egg(): Promise<void> {
    logger.log('Easter egg!');
    logger.log("      _     _");
    logger.log("     /\`\ /`/\\");
    logger.log("     \/\ V /\/");
    logger.log("       /6 6\\");
    logger.log("      (= Y =)");
    logger.log("      /`\"^\"`\\");
    logger.log("     / .-*-. \\");
    logger.log("    (_/*=*=*\_)");
    logger.log("     /\*=*=*/\o");
    logger.log("  ___\ '-*-' /___");
    logger.log(" (((____/^\____)))");
  }
}

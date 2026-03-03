import { Command } from '@oclif/core';
export default class Login extends Command {
    static description: string;
    run(): Promise<void>;
}

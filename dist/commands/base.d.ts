import { Command } from '@oclif/core';
export declare abstract class BaseCommand extends Command {
    protected requireAuth(): void;
}

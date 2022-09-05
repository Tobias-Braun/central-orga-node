import { Injectable, Logger } from '@nestjs/common';
import { ChildProcess, exec, ExecException } from 'child_process';
import { blockDomains, domainRegex } from './blocklist';

@Injectable()
export class PiholeService {

    private readonly logger = new Logger(PiholeService.name);

    private readonly execHandler = (err: ExecException, stdout: string) => {
        if (err) this.logger.error(String(err).trim());
        else this.logger.log(stdout.trim());
    }

    constructor() { }

    async activateBlockList() {
        this.logger.log("activating pihole blocklist");
        blockDomains.forEach(async (domain) => {
            try {
                await this.runSafe(domain, async (domain) => {
                    let command = this.addToBlockListCommand(domain);
                    await exec(command, this.execHandler);
                });
            } catch (error) {
                this.logger.log(`did not push domain into blacklist, reason: ${error}`)
            }
        });
        return Promise.resolve();
    }

    async deactivateBlockList(): Promise<ChildProcess[]> {
        this.logger.log("deactivating pihole blocklist");
        let promises = blockDomains.map(async (domain) => this.runSafe(domain, async (domain) => {
            let command = this.removeFromBlockList(domain);
            return exec(command, this.execHandler);
        }));
        return Promise.all(promises);
    }

    private addToBlockListCommand(domain: string) {
        return `/bin/sh pihole -b "${domain}"`
    }

    private removeFromBlockList(domain: string) {
        return `/bin/sh pihole -b -d "${domain}"`
    }

    private async runSafe<T>(domain: string, cb: (domain: string) => Promise<T>): Promise<T> {
        const isSafe = domainRegex.test(domain);
        if (!isSafe) {
            this.logger.warn(`unsafe domain string detected: ${domain}`);
            return Promise.reject(`unsafe domain string "${domain}"`);
        } else {
            return cb(domain);
        }
    }

}

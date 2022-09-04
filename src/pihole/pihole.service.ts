import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { blockDomains, domainRegex } from './blocklist';

@Injectable()
export class PiholeService {

    private readonly logger = new Logger(PiholeService.name);

    private readonly execHandler = (err, stdout) => {
        if (err) this.logger.error(err);
        else this.logger.log(stdout);
    }

    constructor() { }

    async activateBlockList() {
        this.logger.log("activating pihole blocklist");
        blockDomains.forEach(async (domain) => this.runSafe(domain, async (domain) => {
            let command = this.addToBlockListCommand(domain);
            await exec(command, this.execHandler);
        }));
    }

    async deactivateBlockList() {
        this.logger.log("deactivating pihole blocklist");
        blockDomains.forEach(async (domain) => this.runSafe(domain, async (domain) => {
            let command = this.removeFromBlockList(domain);
            await exec(command, this.execHandler);
        }));
    }

    private addToBlockListCommand(domain: string) {
        return `bash pihole -b "${domain}"`
    }

    private removeFromBlockList(domain: string) {
        return `bash pihole -b "${domain}"`
    }

    private async runSafe<T>(domain: string, cb: (domain: string) => Promise<T>): Promise<T> {
        const isSafe = domainRegex.test(domain);
        if (!isSafe) {
            this.logger.warn("unsafe domain string detected", domain);
            return Promise.reject("unsafe");
        } else {
            return cb(domain);
        }
    }

}

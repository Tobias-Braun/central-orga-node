import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockingStatus } from './blocking-status.entity';

@Injectable()
export class BlockingStatusService {

    private readonly logger = new Logger(BlockingStatusService.name)

    constructor(
        @InjectRepository(BlockingStatus)
        private readonly blockingStatusRepository: Repository<BlockingStatus>
    ) { }

    async getBlockingStatus(): Promise<BlockingStatus> {
        try {
            let blockingStatus = await this.blockingStatusRepository.findOneBy({ id: 1 });
            if (blockingStatus === null) throw Error("no blocking status found");
            return blockingStatus;
        } catch (error) {
            this.logger.error("couldn't find blocking status, creating new default one");
            const defaultBlockingStatus = BlockingStatus.default();
            await this.blockingStatusRepository.save(defaultBlockingStatus);
            return defaultBlockingStatus;
        }
    }

    async updateBlockingStatus(blockingStatus: BlockingStatus): Promise<BlockingStatus> {
        if (blockingStatus.id !== 1) {
            let errorMessage = "tried to update an invalid blocking status (id!=1), aborting"
            this.logger.error(errorMessage);
            return Promise.reject(errorMessage);
        }
        return this.blockingStatusRepository.save(blockingStatus);
    }
}

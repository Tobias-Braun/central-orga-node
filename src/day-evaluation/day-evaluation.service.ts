import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DayEvaluation } from './day-evaluation.entity';

@Injectable()
export class DayEvaluationService {

    private readonly logger = new Logger(DayEvaluationService.name);

    constructor(
        @InjectRepository(DayEvaluation)
        private readonly todoListRepository: Repository<DayEvaluation>,
    ) { }

    addDayEvaluation(dayEvaluation: DayEvaluation) {
        this.logger.log("adding day evaluation", dayEvaluation);
        this.todoListRepository.save(dayEvaluation);
    }

    getDayEvaluationForDateString(dateString: string): Promise<DayEvaluation> {
        return this.todoListRepository.findOneBy({ dateString });
    }
}

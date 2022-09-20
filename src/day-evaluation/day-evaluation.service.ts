import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { DayEvaluation } from './day-evaluation.entity';

@Injectable()
export class DayEvaluationService {
  private readonly logger = new Logger(DayEvaluationService.name);

  constructor(
    @InjectRepository(DayEvaluation)
    private readonly dayEvaluationRepository: Repository<DayEvaluation>,
  ) {}

  async addDayEvaluation(
    dayEvaluation: DayEvaluation,
  ): Promise<DayEvaluation | UpdateResult> {
    this.logger.log('Adding day evaluation: ' + JSON.stringify(dayEvaluation));
    try {
      const existingEntry = await this.dayEvaluationRepository.findOneBy({
        dateString: dayEvaluation.dateString,
      });
      if (existingEntry !== null) {
        // update
        return this.dayEvaluationRepository.update(
          { dateString: dayEvaluation.dateString },
          dayEvaluation,
        );
      } else {
        // save
        return this.dayEvaluationRepository.save(dayEvaluation);
      }
    } catch (error) {
      this.logger.error('Error adding day evaluation: ' + error);
      return Promise.reject(error);
    }
  }

  async getDayEvaluationForDateString(
    dateString: string,
  ): Promise<DayEvaluation> {
    const result = await this.dayEvaluationRepository.findOneBy({ dateString });
    if (result === null)
      return Promise.reject(`Entity not found for ${dateString}`);
    return result;
  }
}

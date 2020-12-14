import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';


interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const { sum: incomeValue } = await this.createQueryBuilder().select('SUM(value)').where({type: 'income',}).getRawOne();

    const { sum: outcomeValue } = await this.createQueryBuilder().select('SUM(value)').where({type: 'outcome',}).getRawOne();

    const income = parseFloat(incomeValue) || 0.0
    const outcome = parseFloat(outcomeValue) || 0.0

    const total = income - outcome 
    
    return { income, outcome, total };
  }
}

export default TransactionsRepository;

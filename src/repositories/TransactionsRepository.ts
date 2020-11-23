import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async findCategory(category: string): Promise<Category | null> {
    const hasCategory = await this.findOne({ where: { category } });

    return hasCategory || null;
  }

  public async getBalance(): Promise<Balance> {
    const income = await (await this.find({ where: { type: 'income' } }))
      .map(el => el.value)
      .reduce(function (values, value) {
        return values + value;
      }, 0);
    const outcome = await (await this.find({ where: { type: 'outcome' } }))
      .map(el => el.value)
      .reduce(function (values, value) {
        return values + value;
      }, 0);

    const total = income - outcome;

    if (total < 0) {
      throw Error('Error: negative total.');
    }

    return { income, outcome, total };
  }
}

export default TransactionsRepository;

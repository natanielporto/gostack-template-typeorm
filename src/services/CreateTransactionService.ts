import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionRepository from '../repositories/TransactionsRepository';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const balance = await transactionRepository.getBalance();

    if (balance.total - value < 0 && type === 'outcome') {
      throw new AppError('Insuficient funds.');
    }

    const checkCategory = categoryRepository.findOne({
      where: { title: category },
    });

    let category_id = '';

    if (!checkCategory) {
      const createCategory = categoryRepository.create({ title: category });

      await categoryRepository.save(createCategory);

      category_id = createCategory.id;
    } else {
      category_id = checkCategory.id;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

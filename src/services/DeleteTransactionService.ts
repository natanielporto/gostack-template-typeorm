import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository'

interface RequestDTO {
  id: string
}

class DeleteTransactionService {
  public async execute({id}: RequestDTO): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository)

    const findTransaction = await transactionRepository.findOne(id)

    if (!findTransaction) {
      throw new AppError('No transaction with that ID. Try again.', 404)
    }

    await transactionRepository.delete(findTransaction.id)
  }
}

export default DeleteTransactionService;

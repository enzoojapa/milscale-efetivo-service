import { MilitarRepository } from '../../domain/MilitarRepository';
import { NotFoundError } from '../errors';

export class DeleteMilitar {
  constructor(private readonly repo: MilitarRepository) {}

  async execute(id: string): Promise<void> {
    const removido = await this.repo.remover(id);
    if (!removido) throw new NotFoundError('Militar nao encontrado');
  }
}

import { MilitarRepository } from '../../domain/MilitarRepository';
import { NotFoundError } from '../errors';
import { MilitarDto, toDto } from '../MilitarDto';

export class GetMilitar {
  constructor(private readonly repo: MilitarRepository) {}

  async execute(id: string): Promise<MilitarDto> {
    const militar = await this.repo.buscarPorId(id);
    if (!militar) throw new NotFoundError('Militar nao encontrado');
    return toDto(militar);
  }
}

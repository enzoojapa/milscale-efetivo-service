import { Situacao } from '../../domain/Militar';
import { MilitarRepository } from '../../domain/MilitarRepository';
import { MilitarDto, toDto } from '../MilitarDto';

export interface ListMilitaresQuery {
  situacao?: Situacao;
  subunidade?: string;
}

export interface ListMilitaresResult {
  total: number;
  aptos: number;
  militares: MilitarDto[];
}

export class ListMilitares {
  constructor(private readonly repo: MilitarRepository) {}

  async execute(query: ListMilitaresQuery = {}): Promise<ListMilitaresResult> {
    const lista = await this.repo.listar(query);
    return {
      total: lista.length,
      aptos: lista.filter((m) => m.estaApto()).length,
      militares: lista.map(toDto),
    };
  }
}

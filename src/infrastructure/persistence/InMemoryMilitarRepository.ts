import { randomUUID } from 'crypto';
import { Militar, Situacao } from '../../domain/Militar';
import { MilitarRepository } from '../../domain/MilitarRepository';

export class InMemoryMilitarRepository implements MilitarRepository {
  private readonly itens = new Map<string, Militar>();

  async salvar(militar: Militar): Promise<Militar> {
    const id = randomUUID();
    const salvo = Militar.restaurar({ ...militar, id });
    this.itens.set(id, salvo);
    return salvo;
  }

  async atualizar(militar: Militar): Promise<Militar> {
    this.itens.set(militar.id as string, militar);
    return militar;
  }

  async buscarPorId(id: string): Promise<Militar | null> {
    return this.itens.get(id) ?? null;
  }

  async buscarPorNomeGuerra(nomeGuerra: string): Promise<Militar | null> {
    return [...this.itens.values()].find((m) => m.nomeGuerra === nomeGuerra) ?? null;
  }

  async listar(filtro: { situacao?: Situacao; subunidade?: string } = {}): Promise<Militar[]> {
    return [...this.itens.values()].filter(
      (m) => (!filtro.situacao || m.situacao === filtro.situacao) && (!filtro.subunidade || m.subunidade === filtro.subunidade),
    );
  }

  async remover(id: string): Promise<boolean> {
    return this.itens.delete(id);
  }
}

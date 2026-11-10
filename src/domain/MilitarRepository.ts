import { Militar, Situacao } from './Militar';

export interface MilitarRepository {
  salvar(militar: Militar): Promise<Militar>;
  atualizar(militar: Militar): Promise<Militar>;
  buscarPorId(id: string): Promise<Militar | null>;
  buscarPorNomeGuerra(nomeGuerra: string): Promise<Militar | null>;
  listar(filtro?: { situacao?: Situacao; subunidade?: string }): Promise<Militar[]>;
  remover(id: string): Promise<boolean>;
}

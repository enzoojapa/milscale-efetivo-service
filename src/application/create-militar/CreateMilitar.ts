import { Graduacao, Militar, Situacao } from '../../domain/Militar';
import { MilitarRepository } from '../../domain/MilitarRepository';
import { ConflictError } from '../errors';
import { MilitarDto, toDto } from '../MilitarDto';

export interface CreateMilitarCommand {
  nomeGuerra: string;
  nomeCompleto: string;
  graduacao: Graduacao;
  subunidade: string;
  situacao?: Situacao;
}

export class CreateMilitar {
  constructor(private readonly repo: MilitarRepository) {}

  async execute(cmd: CreateMilitarCommand): Promise<MilitarDto> {
    const militar = Militar.criar({ ...cmd, situacao: cmd.situacao ?? 'APTO' });
    const existente = await this.repo.buscarPorNomeGuerra(militar.nomeGuerra);
    if (existente) {
      throw new ConflictError(`Ja existe militar com nome de guerra ${militar.nomeGuerra}`);
    }
    const salvo = await this.repo.salvar(militar);
    return toDto(salvo);
  }
}

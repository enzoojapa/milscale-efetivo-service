import { Graduacao, Situacao } from '../../domain/Militar';
import { MilitarRepository } from '../../domain/MilitarRepository';
import { ConflictError, NotFoundError } from '../errors';
import { MilitarDto, toDto } from '../MilitarDto';

export interface UpdateMilitarCommand {
  nomeGuerra?: string;
  nomeCompleto?: string;
  graduacao?: Graduacao;
  subunidade?: string;
  situacao?: Situacao;
}

export class UpdateMilitar {
  constructor(private readonly repo: MilitarRepository) {}

  async execute(id: string, cmd: UpdateMilitarCommand): Promise<MilitarDto> {
    const militar = await this.repo.buscarPorId(id);
    if (!militar) throw new NotFoundError('Militar nao encontrado');

    militar.atualizar(cmd);

    const mesmoNome = await this.repo.buscarPorNomeGuerra(militar.nomeGuerra);
    if (mesmoNome && mesmoNome.id !== militar.id) {
      throw new ConflictError(`Ja existe militar com nome de guerra ${militar.nomeGuerra}`);
    }
    return toDto(await this.repo.atualizar(militar));
  }
}

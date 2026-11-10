import { Militar } from '../domain/Militar';

export interface MilitarDto {
  id: string;
  nomeGuerra: string;
  nomeCompleto: string;
  graduacao: string;
  subunidade: string;
  situacao: string;
  apto: boolean;
  criadoEm: string;
}

export function toDto(m: Militar): MilitarDto {
  return {
    id: m.id as string,
    nomeGuerra: m.nomeGuerra,
    nomeCompleto: m.nomeCompleto,
    graduacao: m.graduacao,
    subunidade: m.subunidade,
    situacao: m.situacao,
    apto: m.estaApto(),
    criadoEm: m.criadoEm.toISOString(),
  };
}

export const GRADUACOES = ['SOLDADO', 'CABO', 'SARGENTO', 'TENENTE', 'CAPITAO'] as const;
export type Graduacao = (typeof GRADUACOES)[number];

export const SITUACOES = ['APTO', 'MISSAO', 'AFASTADO'] as const;
export type Situacao = (typeof SITUACOES)[number];

export interface MilitarProps {
  id?: string;
  nomeGuerra: string;
  nomeCompleto: string;
  graduacao: Graduacao;
  subunidade: string;
  situacao: Situacao;
  criadoEm?: Date;
}

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class Militar {
  readonly id?: string;
  nomeGuerra: string;
  nomeCompleto: string;
  graduacao: Graduacao;
  subunidade: string;
  situacao: Situacao;
  readonly criadoEm: Date;

  private constructor(props: MilitarProps) {
    this.id = props.id;
    this.nomeGuerra = props.nomeGuerra;
    this.nomeCompleto = props.nomeCompleto;
    this.graduacao = props.graduacao;
    this.subunidade = props.subunidade;
    this.situacao = props.situacao;
    this.criadoEm = props.criadoEm ?? new Date();
  }

  static criar(props: MilitarProps): Militar {
    Militar.validar(props);
    return new Militar({ ...props, nomeGuerra: props.nomeGuerra.trim().toUpperCase() });
  }

  static restaurar(props: MilitarProps): Militar {
    return new Militar(props);
  }

  atualizar(dados: Partial<Omit<MilitarProps, 'id' | 'criadoEm'>>): void {
    const novo = {
      nomeGuerra: dados.nomeGuerra ?? this.nomeGuerra,
      nomeCompleto: dados.nomeCompleto ?? this.nomeCompleto,
      graduacao: dados.graduacao ?? this.graduacao,
      subunidade: dados.subunidade ?? this.subunidade,
      situacao: dados.situacao ?? this.situacao,
    };
    Militar.validar(novo);
    Object.assign(this, { ...novo, nomeGuerra: novo.nomeGuerra.trim().toUpperCase() });
  }

  estaApto(): boolean {
    return this.situacao === 'APTO';
  }

  private static validar(props: Omit<MilitarProps, 'id' | 'criadoEm'>): void {
    if (!props.nomeGuerra || props.nomeGuerra.trim().length < 2) {
      throw new DomainError('Nome de guerra deve ter pelo menos 2 caracteres');
    }
    if (!props.nomeCompleto || props.nomeCompleto.trim().length < 5) {
      throw new DomainError('Nome completo deve ter pelo menos 5 caracteres');
    }
    if (!GRADUACOES.includes(props.graduacao)) {
      throw new DomainError(`Graduacao invalida. Use: ${GRADUACOES.join(', ')}`);
    }
    if (!props.subunidade || props.subunidade.trim().length === 0) {
      throw new DomainError('Subunidade e obrigatoria');
    }
    if (!SITUACOES.includes(props.situacao)) {
      throw new DomainError(`Situacao invalida. Use: ${SITUACOES.join(', ')}`);
    }
  }
}

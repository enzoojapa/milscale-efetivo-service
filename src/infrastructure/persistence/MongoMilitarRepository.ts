import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import { Militar, Situacao } from '../../domain/Militar';
import { MilitarRepository } from '../../domain/MilitarRepository';

interface MilitarDocument {
  _id?: ObjectId;
  nomeGuerra: string;
  nomeCompleto: string;
  graduacao: Militar['graduacao'];
  subunidade: string;
  situacao: Situacao;
  criadoEm: Date;
}

export class MongoMilitarRepository implements MilitarRepository {
  private constructor(private readonly collection: Collection<MilitarDocument>) {}

  static async conectar(uri: string, dbName: string): Promise<{ repo: MongoMilitarRepository; client: MongoClient }> {
    const client = new MongoClient(uri);
    await client.connect();
    const db: Db = client.db(dbName);
    const collection = db.collection<MilitarDocument>('militares');
    await collection.createIndex({ nomeGuerra: 1 }, { unique: true });
    return { repo: new MongoMilitarRepository(collection), client };
  }

  async salvar(militar: Militar): Promise<Militar> {
    const doc = this.toDocument(militar);
    const result = await this.collection.insertOne(doc);
    return this.toDomain({ ...doc, _id: result.insertedId });
  }

  async atualizar(militar: Militar): Promise<Militar> {
    const doc = this.toDocument(militar);
    await this.collection.updateOne({ _id: new ObjectId(militar.id) }, { $set: doc });
    return militar;
  }

  async buscarPorId(id: string): Promise<Militar | null> {
    if (!ObjectId.isValid(id)) return null;
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    return doc ? this.toDomain(doc) : null;
  }

  async buscarPorNomeGuerra(nomeGuerra: string): Promise<Militar | null> {
    const doc = await this.collection.findOne({ nomeGuerra });
    return doc ? this.toDomain(doc) : null;
  }

  async listar(filtro: { situacao?: Situacao; subunidade?: string } = {}): Promise<Militar[]> {
    const query: Partial<MilitarDocument> = {};
    if (filtro.situacao) query.situacao = filtro.situacao;
    if (filtro.subunidade) query.subunidade = filtro.subunidade;
    const docs = await this.collection.find(query).sort({ graduacao: 1, nomeGuerra: 1 }).toArray();
    return docs.map((d) => this.toDomain(d));
  }

  async remover(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  private toDocument(m: Militar): MilitarDocument {
    return {
      nomeGuerra: m.nomeGuerra,
      nomeCompleto: m.nomeCompleto,
      graduacao: m.graduacao,
      subunidade: m.subunidade,
      situacao: m.situacao,
      criadoEm: m.criadoEm,
    };
  }

  private toDomain(doc: MilitarDocument): Militar {
    return Militar.restaurar({
      id: doc._id?.toHexString(),
      nomeGuerra: doc.nomeGuerra,
      nomeCompleto: doc.nomeCompleto,
      graduacao: doc.graduacao,
      subunidade: doc.subunidade,
      situacao: doc.situacao,
      criadoEm: doc.criadoEm,
    });
  }
}

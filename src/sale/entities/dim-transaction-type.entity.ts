import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DimSequence } from "./dim-sequence.entity";

@Index("dim_transaction_type_pk", ["idTransactionType"], { unique: true })
@Entity("dim_transaction_type", { schema: "engine" })
export class DimTransactionType {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_transaction_type" })
  idTransactionType: number;

  @Column("integer", { name: "code" })
  code: number;

  @Column("character varying", { name: "name" })
  name: string;

  @OneToMany(() => DimSequence, (dimSequence) => dimSequence.idTransactionType)
  dimSequences: DimSequence[];
}

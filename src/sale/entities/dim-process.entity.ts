import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DimSequence } from "./dim-sequence.entity";

@Index("dim_process_pk", ["idProcess"], { unique: true })
@Entity("dim_process", { schema: "engine" })
export class DimProcess {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_process" })
  idProcess: number;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("character varying", { name: "url", nullable: true })
  url: string | null;

  @OneToMany(
    () => DimSequence,
    (dimSequence) => dimSequence.idProcessPredecessor
  )
  dimSequences: DimSequence[];

  @OneToMany(() => DimSequence, (dimSequence) => dimSequence.idProcessSuccesor)
  dimSequences2: DimSequence[];
}

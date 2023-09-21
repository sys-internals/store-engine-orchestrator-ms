import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DimTransactionType } from "./dim-transaction-type.entity";
import { FactWorkflow } from "./fact-workflow.entity";
import { DimProcess } from "./dim-process.entity";

@Index("dim_sequence_pk", ["idSequence"], { unique: true })
@Entity("dim_sequence", { schema: "engine" })
export class DimSequence {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_sequence" })
  idSequence: number;

  @ManyToOne(() => DimProcess, (dimProcess) => dimProcess.dimSequences)
  @JoinColumn([
    { name: "id_process_predecessor", referencedColumnName: "idProcess" },
  ])
  idProcessPredecessor: DimProcess;

  @ManyToOne(() => DimProcess, (dimProcess) => dimProcess.dimSequences2)
  @JoinColumn([
    { name: "id_process_succesor", referencedColumnName: "idProcess" },
  ])
  idProcessSuccesor: DimProcess;

  @ManyToOne(
    () => DimTransactionType,
    (dimTransactionType) => dimTransactionType.dimSequences
  )
  @JoinColumn([
    { name: "id_transaction_type", referencedColumnName: "idTransactionType" },
  ])
  idTransactionType: DimTransactionType;

  @OneToMany(() => FactWorkflow, (factWorkflow) => factWorkflow.idSequence)
  factWorkflows: FactWorkflow[];
}

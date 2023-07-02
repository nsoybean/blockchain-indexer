import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BlockTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  txn_hash: string;

  @Column()
  block_hash: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  data: { [key: string]: any }; // any datatype

  @CreateDateColumn()
  //   @Column({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP()',
  })
  updated_at: Date;
}

export interface IBlockTransaction {
  block_hash: string;
  txn_hash?: string;
  data?: { [key: string]: any };
}

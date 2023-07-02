import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AddressTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  txn_hash: string;

  @Column()
  address: string;

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

export interface IAddressTransaction {
  txn_hash: string;
  address?: string;
}

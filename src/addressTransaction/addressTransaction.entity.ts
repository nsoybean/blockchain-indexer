import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique('address_txn', ['address', 'txn_hash']) // composite
export class AddressTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
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

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true, nullable: true })
  hash: string;

  @Column({ nullable: true })
  verified_prev_block_of: string;

  @Column({ nullable: true })
  height: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  data: { [key: string]: any }; // any datatype

  @Column({ type: 'timestamp', nullable: true })
  time: string;

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

export interface IBlock {
  hash: string;
  verified_prev_block_of?: string;
  height?: number;
  data?: { [key: string]: any };
  time?: string;
}

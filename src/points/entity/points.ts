import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TransactionType } from 'src/utils/transaction-type.enum';
import { User } from 'src/user/entity/user';

@Entity()
export class Points {
  @PrimaryGeneratedColumn('increment')
  transactionId: number;

  @Column({ nullable: false })
  points: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false,
  })
  transactionType: TransactionType;

  @Column({ nullable: false })
  remainingPoints: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.uuid)
  uuid: User;
}

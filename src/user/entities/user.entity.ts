import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatus } from '../interfaces/user-status.enum';
import { UserRole } from '../interfaces/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.UNVERIFIED,
  })
  status: UserStatus;

  @Column({
    nullable: true,
    type: 'uuid',
  })
  verificationLink: string;

  @Column({
    nullable: true,
    type: 'uuid',
    default: null,
  })
  resubmitPasswordLink;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Customer,
  })
  role: UserRole;
}

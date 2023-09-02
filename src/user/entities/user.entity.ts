import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserStatus {
  UNVERIFIED = 'unverified',
  VERIFIED = 'verified',
}

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

  @Column()
  password: string;
}

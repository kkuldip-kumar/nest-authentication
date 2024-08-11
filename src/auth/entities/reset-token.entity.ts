import { User } from "@/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity('reset-token')
export class ResetToken {
  @Column()
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ nullable: false })
  token: string;
  @ManyToOne(() => User, user => user.resetTokens, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  expiryDate: Date;
}

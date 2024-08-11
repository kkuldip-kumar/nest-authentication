import { RefreshToken } from '@/auth/entities/refresh-token.entity';
import { ResetToken } from '@/auth/entities/reset-token.entity';
import { Exclude } from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,

} from 'typeorm';

export enum UserStatus {
    Active = "active",
    INACTIVE = "in_active",

}
@Entity('users')
export class User {
    @Column()
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    name: string;
    @Column()
    email: string;
    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.Active
    })
    status: UserStatus;
    @Column()
    @Exclude()
    password: string;
    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updatedAt: Date
    @OneToMany(() => ResetToken, resetToken => resetToken.user)
    resetTokens: ResetToken[];
    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken[];
    @DeleteDateColumn({ nullable: true, select: false })
    deletedAt?: Date;

}

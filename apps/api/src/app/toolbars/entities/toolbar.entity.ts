import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Session } from '../../sessions/entities/session.entity';

@Entity()
export class Toolbar extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Session, (session) => session.toolbars)
  @IsNotEmpty()
  session: Session;

  @Column()
  sessionId: number;

  @Column('simple-json', { default: '[]' })
  markers: [{ markerId: number; visible: boolean }];
}

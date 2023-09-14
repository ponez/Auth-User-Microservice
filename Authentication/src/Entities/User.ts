import { UserType } from '@Infrastructure/Enum/User';
import { BaseEntity, Column, Entity, ObjectId, ObjectIdColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
	@ObjectIdColumn()
	id: ObjectId;

	@Column({ type: 'string', length: 20, nullable: false })
	username: string;

	@Column({ type: 'string', length: 50, nullable: false })
	email: string;

	@Column({ type: 'string', length: 22, nullable: false, select: false })
	password: string;

	@Column({ type: 'string', length: 22, nullable: false, select: false })
	type: UserType;

	@Column({ type: 'boolean', default: false, nullable: false })
	isActive: boolean;
}

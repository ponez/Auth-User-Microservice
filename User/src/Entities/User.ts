import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Entity({name: "user"})
@Unique(['email'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: 'varchar'})
	mongodbId: string;

	@Column({type: 'varchar', length: 20, nullable: false})
	username: string;

	@Column({type: 'varchar', length: 50, nullable: false})
	email: string;

	@Column({type: 'varchar', length: 22, nullable: true})
	nickName: string;
}

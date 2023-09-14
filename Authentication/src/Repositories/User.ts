import { User } from '@Entities/User';
import { ObjectId } from 'mongodb';
import { getResource } from './Shared';

export namespace UserRepository {
	export const findOneWithEmail = async (email: string): Promise<User> => {
		return await getResource(User, { where: { email } });
	};
	export const findOneWithEmailForSignUp = async (email: string): Promise<User> => {
		return await getResource(User, { where: { email } }, false);
	};
	export const findOneWithId = async (id: string): Promise<User> => {
		return await getResource(User, { where: { _id: new ObjectId(id) } });
	};
}

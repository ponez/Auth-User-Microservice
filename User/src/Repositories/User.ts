import {User} from '@Entities/User';
import {getAllResource, getResource} from './Shared';


export namespace UserRepository {
	export const findAllUsers = async (): Promise<User[]> => {
		return await getAllResource(User, {});
	};
	export const findOneWithMongoId = async (mongodbId: string): Promise<User> => {
		return await getResource(User, {where: {mongodbId}});
	};
	export const findOneWithMongoIdOrFail = async (mongodbId: string): Promise<User> => {
		return await getResource(User, {where: {mongodbId}}, false);
	};
	export const findOneWithEmailOrFail = async (email: string): Promise<User> => {
		return await getResource(User, {where: {email}}, false);
	};
}



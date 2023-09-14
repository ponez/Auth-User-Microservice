import { getManager, ObjectType } from 'typeorm';
import { Throw404 } from './ErrorHelpers';

export const getResource = async <E extends {}>(
	entityClass: ObjectType<E>,
	options: {},
	fail: boolean = true,
): Promise<E> => {
	const resource = await getManager().findOne(entityClass, options);
	if (fail) {
		Throw404(resource, `Resource can't be found with options: ${JSON.stringify(options)}`);
	}

	return resource as E;
};

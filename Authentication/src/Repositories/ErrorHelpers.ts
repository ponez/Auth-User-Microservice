import { Errors } from 'moleculer';

export const Throw404 = <R extends {}>(resource: R | undefined | null, message: string): R => {
	if (!resource) {
		throw new Errors.MoleculerError(message, 404, 'Not Found');
	}
	return resource;
};
export const Throw401 = <R extends {}>(resource: R | undefined | null, message: string): R => {
	if (!resource) {
		throw new Errors.MoleculerError(message, 401, 'Unauthorized');
	}
	return resource;
};
export const Throw400 = <R extends {}>(resource: R | undefined | null, message: string): R => {
	if (!resource) {
		throw new Errors.MoleculerError(message, 400, 'Bad Request');
	}
	return resource;
};

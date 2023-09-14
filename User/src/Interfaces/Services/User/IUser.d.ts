import {UserType} from '@Infrastructure/Enum/User';

export namespace IUser {
	interface IUser {
		email: string;
		password: string;
	}

	interface IdInput {
		id: string;
	}

	export interface IToken {
		id: string;
		username: string;
		type: UserType;
		exp: number;
	}

	export interface SignupDto extends IUser {
		username: string;
	}

	export interface LoginDto extends IUser {
	}
}

import { UserType } from '@Infrastructure/Enum/User';

export namespace IAuthentication {
	interface IUser {
		email: string;
		password: string;
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

	export interface LoginDto extends IUser {}
}

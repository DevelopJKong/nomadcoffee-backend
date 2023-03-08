import { CreateAccountInput, CreateAccountOutput } from '../dto/create-account.dto';
export interface IUserService {
  createAccount(createAccountInput: CreateAccountInput): Promise<CreateAccountOutput>;
}

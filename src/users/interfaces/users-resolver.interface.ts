import { CreateAccountInput, CreateAccountOutput } from '../dto/create-account.dto';
import { LoginInput, LoginOutput } from '../dto/login.dto';
import { EditProfileInput, EditProfileOutput } from '../dto/edit-profile.dto';
import { SeeProfileInput, SeeProfileOutput } from '../dto/see-profile.dto';
export interface IUserService {
  createAccount(createAccountInput: CreateAccountInput): Promise<CreateAccountOutput>;
  login(loginInput: LoginInput): Promise<LoginOutput>;
  seeProfile(userId: number, seeProfileInput: SeeProfileInput): Promise<SeeProfileOutput>;
  editProfile(userId: number, editProfileInput: EditProfileInput): Promise<EditProfileOutput>;
}

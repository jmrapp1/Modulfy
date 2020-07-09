import { Service } from 'typedi';
import { encode } from 'jwt-simple';
import UserDataModel, { UserDocument } from '../models/User';
import { ServiceResponse } from '@jrapp/server-core-web';
import { MongoDal } from '@jrapp/server-dal-mongodb';
import {
    JwtResource,
    UserLoginMapper,
    UserRegisterMapper,
    UserRegisterResource,
    UserLoginResource
} from '@jrapp/shared-resources-user';
import { ModuleContext, ModuleLogger } from '../index';

@Service()
export default class UserService extends MongoDal<UserDocument> {

    constructor() {
        super(UserDataModel);
    }

    /**
     * Logs a user in
     * @param loginResource The login resource
     * @returns {Promise<ServiceResponse>} The JWT token if successful, error if unsuccessful
     */
    async login(loginResource: UserLoginResource): Promise<ServiceResponse<JwtResource>> {
        if (!loginResource.validated) {
            const error = UserLoginMapper.verifyAllConstraints(loginResource);
            if (error) throw new ServiceResponse(error);
        }

        const userSearch = await this.find({ username: loginResource.username }, 1);
        if (!userSearch.isEmpty()) {
            const user = userSearch.data[0];
            const passValidated = await (user as any).comparePassword(loginResource.password);
            if (passValidated) {
                const token = encode(user, ModuleContext.getTokenSecret());
                return new ServiceResponse(new JwtResource().init('JWT ' + token));
            }
            throw new ServiceResponse('The username or password is incorrect.', 400);
        }
        throw new ServiceResponse('The username or password is incorrect.', 400);
    }

    async validateRegisterData(registerResource: UserRegisterResource): Promise<ServiceResponse<any>> {
        if (!registerResource.validated) {
            const error = UserRegisterMapper.verifyAllConstraints(registerResource);
            if (error) throw new ServiceResponse(error);
        }

        const res = await this.find({
            $or: [
                { email: registerResource.email },
                { username: registerResource.username }
            ]
        }, 1);

        if (res.isEmpty()) {
            return new ServiceResponse();
        } else {
            if (res.data[0].username === registerResource.username) {
                throw new ServiceResponse('That username has already been used.', 400);
            }
            throw new ServiceResponse('That email has already been used.', 400);
        }
    }

    async register(registerResource: UserRegisterResource): Promise<ServiceResponse<UserDocument>> {
        await this.validateRegisterData(registerResource);
        return this.insert({
            username: registerResource.username,
            email: registerResource.email,
            firstName: registerResource.firstName,
            lastName: registerResource.lastName,
            phone: registerResource.phone,
            password: registerResource.password,
        });

    }
}
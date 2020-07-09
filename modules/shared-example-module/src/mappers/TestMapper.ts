import { ResourceMapper } from '@jrapp/shared-core-resources';
import TestResource from '../resources/TestResource';

class TestMapper extends ResourceMapper {

    id = 'TestMapper';
    resourceType = TestResource;

    build(data): TestResource {
        return new TestResource().init(data.message);
    }

    verifyStrictConstraints(resource) {
        if (!resource.message || resource.message.length < 15) {
            return 'Please enter a message that is at least 15 characters long.';
        }
    }

    getUndefinedKeyResponse(key: string) {
        return 'Please enter a message.';
    }

}

export default new TestMapper();

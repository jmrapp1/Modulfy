import "reflect-metadata";
import { Get, JsonController, Param, Post, Req, Res, UseBefore } from 'routing-controllers';
import TestService from '../services/TestService';
import { Container } from 'typedi';
import { AuthMiddleware, BuildResource } from '@jrapp/server-middlewares';
import { TestMapper, TestResource } from '@jrapp/shared-example-module';
import { AbstractController } from '@jrapp/server-abstract-framework';
import { Logger } from '@jrapp/server-logging';
import { HeaderMiddleware } from '@jrapp/server-middlewares';

@UseBefore(HeaderMiddleware)
@JsonController('/test')
export default class TestController extends AbstractController {

    testService: TestService;

    constructor() {
        super();
        this.testService = Container.get(TestService);
    }

    @Get('/:id')
    getTestStrict(@Res() res: any, @Param('id') id: string) {
        return this.testService.getTest(id).then(
            response => res.status(200).json(response.data),
            err => this.handleServiceError(res, err)
        );
    }

    @Post('/create')
    createTest(@BuildResource(TestMapper) testResource: TestResource, @Res() res: any) {
        if (!testResource) return res;
        return this.testService.createTest(testResource).then(
            response => res.status(200).json(response.data),
            err => this.handleServiceError(res, err)
        );
    }

}
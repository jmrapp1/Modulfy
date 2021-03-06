import "reflect-metadata";
import { Get, JsonController, Param, Post, Req, Res, UseBefore } from 'routing-controllers';
import TestService from '../services/TestService';
import { Container } from 'typedi';
import { TestMapper, TestResource } from '@modulfy/example';
import { AbstractController, HeaderMiddleware, AuthMiddleware, BuildResource } from '@modulfy/core-web';
import { ExampleWebModule } from '../index';

@UseBefore(HeaderMiddleware)
@JsonController('/test')
export default class TestController extends AbstractController {

    testService: TestService;

    constructor() {
        super(ExampleWebModule.logger);
        this.testService = Container.get(TestService);
    }

    @Get('/:id')
    getTestStrict(@Res() res: any, @Param('id') id: string) {
        return this.testService.getTestById(id).then(
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
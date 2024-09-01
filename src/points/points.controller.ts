import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { PointsService } from './points.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { User } from 'src/user/entity/user';

@UseGuards(JwtAuthGuard)
@Controller('points')
export class PointsController {
  constructor(private pointService: PointsService) {}

  @Post('/add')
  async addPoints(@Body() uuid: User) {
    return await this.pointService.addPoints(uuid);
  }

  @Post('/use')
  async usePoints(@Body() uuid: User) {
    //포인트 사용처를 기록하는 부분 필요
    return await this.pointService.usePoints(uuid);
  }

  @Post('/cancel')
  async cancelUsedPoints(@Body() transactionId: number) {
    //포인트 사용처를 찾아서, transactionId를 가져와야하는 구간 필요
    //실제로 클라이언트에서 transcationId를 가지고 있을 수 없기 때문에
    //village 영역 들어가면서 개편해야하는 사항
    return await this.pointService.cancelUsedPoints(transactionId);
  }
}

import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { PointsService } from './points.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { User } from 'src/user/entity/user';
import { pointUsagesDto } from './dto/point-usages.dto';

@UseGuards(JwtAuthGuard)
@Controller('points')
export class PointsController {
  constructor(private pointService: PointsService) {}

  @Post('/add')
  async addPoints(@Body() uuid: User) {
    return await this.pointService.addPoints(uuid);
  }

  //building과 coordinate를 하나로 묶어버릴 순 없을까? => dto ?
  @Post('/use')
  async usePoints(@Body() uuid: User, newUsages: pointUsagesDto) {
    const transactionId = await this.pointService.usePoints(uuid);
    //포인트 사용처를 기록하는 부분 필요
    await this.pointService.saveTranscationInUsageLocation(
      transactionId.transactionId,
      newUsages,
    );
  }

  @Post('/cancel')
  async cancelUsedPoints(@Body() usedHistory: pointUsagesDto) {
    //포인트 사용처를 찾아서, transactionId를 가져와야하는 구간 필요
    //위치만 알아도 되지 않을까??
    //건물의 종류와 위치 2가지 모두 알아야하는 이유는??
    //건물에 따라 배치 포인트가 다르거나, 가지고 있는 건물의 갯수 제한이 있을 수 있음
    //이게 상관없다면 위치로만 조회하도록 수정할 필요 O
    const transactionId =
      await this.pointService.findTransactionInUsageLocation(
        usedHistory.building,
        usedHistory.location,
      );

    return await this.pointService.cancelUsedPoints(transactionId);
  }
}

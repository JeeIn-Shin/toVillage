import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from 'src/utils/transaction-type.enum';
import { Points } from '../points/entity/points';
import { UsageLocation } from './entity/usageLocation';
import { User } from 'src/user/entity/user';
import { pointUsagesDto } from './dto/point-usages.dto';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Points)
    private PointsRepository: Repository<Points>,
    @InjectRepository(UsageLocation)
    private UsageLocationRepository: Repository<UsageLocation>,
  ) {}

  async addPoints(req: User) {
    const pointsToAdd = 5;

    const lastTransaction = await this.PointsRepository.findOne({
      where: { user: { uuid: req.uuid } },
      order: { createdAt: 'DESC' },
    });

    const newRemainingPoints =
      (lastTransaction?.remainingPoints || 0) + pointsToAdd;

    // 새로운 포인트 트랜잭션 기록
    const newTransaction = this.PointsRepository.create({
      user: lastTransaction?.user || req,
      points: pointsToAdd,
      transactionType: TransactionType.ACQUIRE,
      remainingPoints: newRemainingPoints,
      createdAt: new Date(),
    });

    return this.PointsRepository.save(newTransaction);
  }

  async usePoints(req: User) {
    const pointsToMinus = -5;

    const lastTransaction = await this.PointsRepository.findOne({
      where: { user: { uuid: req.uuid } },
      order: { createdAt: 'DESC' },
    });

    const newRemainingPoints =
      (lastTransaction?.remainingPoints || 0) + pointsToMinus;

    // 사용한 포인트 트랜잭션 기록
    const newTransaction = this.PointsRepository.create({
      user: lastTransaction?.user || req,
      points: pointsToMinus,
      transactionType: TransactionType.USE,
      remainingPoints: newRemainingPoints,
      createdAt: new Date(),
    });

    return await this.PointsRepository.save(newTransaction);
  }

  //사용한 포인트 취소
  //사용한 포인트를 rollback 할려면 어떻게 해야하지?
  //트랙잭션 id로 조회하게끔 해놓긴 했으나, 클라이언트에서는 id를 어떻게 알고 보내지?
  //클라이언트에서는 이걸 다 가지고 있을 수 없는데
  async cancelUsedPoints(transactionId: number): Promise<Points> {
    //취소하려는 트랜잭션 조회
    const transactionToCancel = await this.PointsRepository.findOne({
      where: { transactionId: transactionId },
      relations: ['user'], // user 관계를 함께 조회
    });

    if (
      !transactionToCancel ||
      transactionToCancel.transactionType !== TransactionType.USE
    ) {
      throw new NotFoundException(
        '취소할 포인트 사용 내역을 찾을 수 없습니다.',
      );
    }

    //사용자 가장 최신 남은 포인트 조회
    const lastTransaction = await this.PointsRepository.findOne({
      where: { user: { uuid: transactionToCancel.user.uuid } }, // user의 uuid 사용
      order: { createdAt: 'DESC' },
    });

    if (!lastTransaction) {
      throw new Error('포인트 이력이 없습니다.');
    }

    //포인트 복구 및 새로운 남은 포인트 계산
    const recoveredPoints = transactionToCancel.points;
    const newRemainingPoints =
      lastTransaction.remainingPoints + recoveredPoints;

    //취소 트랜잭션 기록
    const cancelTransaction = this.PointsRepository.create({
      user: transactionToCancel.user, // user 객체를 그대로 사용
      points: recoveredPoints,
      transactionType: TransactionType.CANCEL,
      remainingPoints: newRemainingPoints,
      createdAt: new Date(),
    });

    //트랜잭션 저장
    return this.PointsRepository.save(cancelTransaction);
  }

  //point 관련 트랜잭션 조회 api
  //return 값은 transcationId가 나와야함
  async findTransactionInUsageLocation(building: string, coordinate: string) {
    //주어진 name과 location에 해당하는 UsageLocation을 찾음
    const usageLocation = await this.UsageLocationRepository.findOne({
      where: {
        name: building,
        location: coordinate,
      },
    });

    if (!usageLocation) {
      throw new Error('해당 사용처를 찾을 수 없습니다.');
    }

    return usageLocation.id;
  }

  async saveTranscationInUsageLocation(
    id: number, // point table의 기본키가 들어와야함
    newUsages: pointUsagesDto,
  ) {
    const newViilageUsage = this.UsageLocationRepository.create({
      name: newUsages.building,
      location: newUsages.location,
      id: id,
    });

    return await this.UsageLocationRepository.save(newViilageUsage);
  }
}

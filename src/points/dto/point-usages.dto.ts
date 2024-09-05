import { IsString } from 'class-validator';

//나중에 섹션에 대한 정보 추가 예정
export class pointUsagesDto {
  // @IsNumber()
  // section: number;

  @IsString()
  building: string;

  @IsString()
  location: string;
}

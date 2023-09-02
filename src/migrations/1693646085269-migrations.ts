import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1693646085269 implements MigrationInterface {
  name = 'Migrations1693646085269';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "resubmitPasswordLink" uuid`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "resubmitPasswordLink"`,
    );
  }
}

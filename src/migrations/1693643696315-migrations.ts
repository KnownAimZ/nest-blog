import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1693643696315 implements MigrationInterface {
  name = 'Migrations1693643696315';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "verificationLink" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "verificationLink"`,
    );
  }
}

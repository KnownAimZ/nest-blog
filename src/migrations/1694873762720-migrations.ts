import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1694873762720 implements MigrationInterface {
  name = 'Migrations1694873762720';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "price" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`);
  }
}

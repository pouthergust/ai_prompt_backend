import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1704000000000 implements MigrationInterface {
    name = 'InitialMigration1704000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prompts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" text NOT NULL, "category" character varying NOT NULL, "tags" text array NOT NULL DEFAULT '{}', "isFavorite" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_7f33fc166d8423b3b99c37bb365" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "prompts" ADD CONSTRAINT "FK_4c8b4b5b5b5b5b5b5b5b5b5b5b5b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prompts" DROP CONSTRAINT "FK_4c8b4b5b5b5b5b5b5b5b5b5b5b5b"`);
        await queryRunner.query(`DROP TABLE "prompts"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
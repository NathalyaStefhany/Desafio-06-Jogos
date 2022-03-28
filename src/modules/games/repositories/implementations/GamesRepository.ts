import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    // Complete usando query builder
    return await this.repository
      .createQueryBuilder("games")
      .select("games.title")
      .where("games.title ILIKE :param", { param: `%${param}%` })
      .groupBy("games.id")
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    // Complete usando raw query
    return await this.repository.query("SELECT COUNT(*) AS count FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    // Complete usando query builder
    return (
      await this.repository
        .createQueryBuilder("games")
        .leftJoinAndSelect("games.users", "user")
        .where("games.id = :id", { id })
        .getOne()
    )?.users as User[];
  }
}

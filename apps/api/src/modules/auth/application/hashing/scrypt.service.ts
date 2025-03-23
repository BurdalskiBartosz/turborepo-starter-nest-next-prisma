import { Injectable } from "@nestjs/common";
import { scrypt as _scrypt, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(_scrypt);

@Injectable()
export class ScryptService {
  async hash(data: string | Buffer): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scrypt(data, salt, 32)) as Buffer;
    return `${salt}.${derivedKey.toString("hex")}`;
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    const [salt, key] = encrypted.split(".");
    const derivedKey = (await scrypt(data, salt, 32)) as Buffer;
    return key === derivedKey.toString("hex");
  }
}

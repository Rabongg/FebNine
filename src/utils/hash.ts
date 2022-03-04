import * as argon2 from 'argon2';
export class Hash {
  static encrypt(password: string) {
    return argon2.hash(password, { type: argon2.argon2id });
  }

  static validate(hash: string, password: string) {
    return argon2.verify(hash, password);
  }
}

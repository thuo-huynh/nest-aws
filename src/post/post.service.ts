import { Injectable } from '@nestjs/common';

export interface Post {
  readonly name: string;
  readonly content: string;
}

@Injectable()
export class PostService {
  listAllPost(): Array<Post> {
    return [
      { name: 'Tech', content: 'Hehe' },
      { name: 'Fin', content: 'Hihi' },
      { name: 'Life', content: 'Haha' },
    ];
  }
}

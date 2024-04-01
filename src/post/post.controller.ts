import { Controller, Get, UseGuards } from '@nestjs/common';
import { Post, PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  listAllPokemons(): Array<Post> {
    return this.postService.listAllPost();
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Retrieve Bearer token from the header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Specify the client ID of Cognito
      audience: process.env.AWS_COGNITO_COGNITO_CLIENT_ID,
      // Issuer of the JWT. In this case, it's Cognito
      issuer: process.env.AWS_COGNITO_AUTHORITY,
      algorithms: ['RS256'],
      // If you are issuing the JWT yourself, specify the secret key,
      // otherwise, if issued by external services like Cognito, use secretOrKeyProvider.
      secretOrKeyProvider: passportJwtSecret({
        // Cache the public key. If set to false, public keys
        // need to be retrieved via HTTP request for every request
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.AWS_COGNITO_AUTHORITY + '/.well-known/jwks.json',
      }),
    });
  }

  async validate(payload: any) {
    return { idUser: payload.sub, email: payload.email };
  }
}

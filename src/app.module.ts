import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),

    // GraphQLModule.forRootAsync({
    //   driver: ApolloDriver,
    //   imports: [AuthModule], // Importar modulos
    //   inject: [ JwtService ], // INyectar servicios
    //   useFactory: async ( jwtService: JwtService ) => {
    //     return {
    //       autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //       playground: false,
    //       plugins: [
    //         ApolloServerPluginLandingPageLocalDefault
    //       ],
    //       context({req}){
    //         const token = req.headers.authorization?.replace('Bearer ', '');
    //         if(!token) throw Error('Token necesario');
    //         const payload = jwtService.decode(token);
    //         if(!payload) throw Error('Token invalido')
    //       }
    //     }
    //   }
    // }),
    // TODO: Configuración basica
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
  ]
})
export class AppModule { }

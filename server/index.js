import koa from 'koa'; // koa@2 
import koaRouter from 'koa-router'; // koa-router@next 
import koaBody from 'koa-bodyparser'; // koa-bodyparser@next 
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa';
import cors from 'kcors';
import { schema } from './src/schema';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
const app = new koa();
const router = new koaRouter();
const PORT = 4000;

// koaBody is needed just for POST. 
app.use(cors());
app.use(koaBody());
router.get('/', (ctx) => {
    ctx.body = "hello world";
});
router.post('/graphql', graphqlKoa({ schema: schema }));
router.get('/graphiql', graphiqlKoa(
    {
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
    }));
// router.get('/graphql', graphqlKoa({ schema: schema }));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
    console.log(`GraphQL Server is now running on http://localhost:${PORT}`);

    // Set up the WebSocket for handling GraphQL subscriptions
    new SubscriptionServer({
        execute,
        subscribe,
        schema
    }, {
            server: app,
            path: '/subscriptions',
        });
});
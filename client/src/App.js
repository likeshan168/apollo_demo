import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { ApolloClient, gql, graphql, ApolloProvider, createNetworkInterface, toIdValue } from 'react-apollo';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import ChannelsList from './component/ChannelsListWithData';
import { ChannelsListWithData } from './component/ChannelsListWithData';
import NotFound from './component/NotFound';
import ChannelDetails from './component/ChannelDetails';
// mock networkinterface
// import {
//   makeExecutableSchema,
//   addMockFunctionsToSchema
// } from 'graphql-tools';
// import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
// import { typeDefs } from './schema';
// const schema = makeExecutableSchema({ typeDefs });
// addMockFunctionsToSchema({ schema });
// const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });

// const client = new ApolloClient({
//   networkInterface: mockNetworkInterface
// });

//connect to the real graphql server
const networkInterface = createNetworkInterface({
  uri: 'http://localhost:4000/graphql',
});
networkInterface.use([{
  applyMiddleware(req, next) {
    setTimeout(next, 500)
  }
}])
const wsClient = new SubscriptionClient(`ws://localhost:4000/subscriptions`, {
  reconnect: true,
});
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);
function dataIdFromObject(result) {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
}

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  customResolvers: {
    Query: {
      channel: (_, args) => {
        return toIdValue(dataIdFromObject({ __typename: 'Channel', id: args['id'] }))
      }
    }
  },
  dataIdFromObject,
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div className="App">
            <Link to="/" className="navbar">React + GraphQL Tutorial</Link>
            <Switch>
              <Route exact path="/" component={ChannelsListWithData} />
              <Route path="/channel/:channelId" component={ChannelDetails} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;

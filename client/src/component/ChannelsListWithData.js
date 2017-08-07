import React from 'react';
import AddChannel from './AddChannel';
import { gql, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
//component
const ChannelsList = ({ data: { loading, error, channels } }) => {

    if (loading) {
        return <p>loading...</p>;
    }
    if (error) {
        return <p>{error.message}</p>;
    }
    return <ul>
        <div className="channelsList">
            <AddChannel />
            {channels.map(ch =>
                (<div key={ch.id} className={'channel ' + (ch.id < 0 ? 'optimistic' : '')}>
                    <Link to={ch.id < 0 ? `/` : `channel/${ch.id}`}>
                        {ch.name}
                    </Link>
                </div>)
            )}
        </div>
    </ul>
};

//query
export const channelsListQuery = gql`
  query ChannelsListQuery{
    channels{
      id
      name
    }
  }
`;
//component with query
export const ChannelsListWithData = graphql(channelsListQuery,
    { options: { pollInterval: 500 } }
)(ChannelsList)


import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

// This is our own render user props component that we'll use througout the app

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
    }
  }
`;

// This will just pass the payload right to the children props
const User = props => (
  <Query {...props} query={CURRENT_USER_QUERY}>
    {payload => console.log(payload) || props.children(payload)}
  </Query>
);
User.PropTypes = {
  children: PropTypes.func.isRequired
};

export default User;
export { CURRENT_USER_QUERY };

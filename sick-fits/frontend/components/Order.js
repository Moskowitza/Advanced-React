import React, { Component } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { format } from "date-fns";
import Head from "next/head";
import gql from "graphql-tag";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import OrderStyle from "./styles/OrderStyles";

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

class Order extends Component {
  static PropTypes = {
    id: PropTypes.string.isRequired
  };
  render() {
    return (
      <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id }}>
        {({ data, error, loading }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          const order = data.order;
          return (
            <OrderStyle>
              <Head>
                <title>Sick Fits - Order -{order.id}</title>
              </Head>
              <p>
                <span> OrderID: </span>
                <span> {this.props.id}</span>
              </p>
              <p>
                <span> Charge: </span>
                <span> {order.charge}</span>
              </p>
              <p>
                <span> Date: </span>
                <span> {format(order.createdAt, "MMMM d, YYYY h:mm a")}</span>
              </p>
              <p>
                <span> Order Total: </span>
                <span> {formatMoney(order.total)}</span>
              </p>
              <p>
                <span> Item Count: </span>
                <span> {order.items.length}</span>
              </p>
              <div className="items">
                {order.items.map(item => (
                  <div className="order-item" key={item.id}>
                    <img src={item.image} alt={item.title} />
                    <div className="item-details">
                      <h2>{item.title}</h2>
                      <p>{item.quantity}</p>
                      <p>Each: {formatMoney(item.price)}</p>
                      <p>SubTot: {formatMoney(item.price * item.quantity)}</p>
                      <p>Description: {item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OrderStyle>
          );
        }}
      </Query>
    );
  }
}

export default Order;

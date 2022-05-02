import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HomeScreen() {
  const [{ products, loading, error }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const res = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: error.message });
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}

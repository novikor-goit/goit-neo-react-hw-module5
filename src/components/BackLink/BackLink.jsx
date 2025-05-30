import { Link } from 'react-router-dom';
import React from 'react';

export default function BackLink({ path = '/' }) {
  return <Link to={path}>Go Back</Link>;
}

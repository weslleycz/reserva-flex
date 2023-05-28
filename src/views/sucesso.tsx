import React, { ReactElement } from 'react';

export interface Props {
  name: string;
}

const Sucesso = ({ name }: Props): ReactElement => (
  <body
    style={{ background: '#F7F6F6', textAlign: 'center', padding: '10%' }}
  ></body>
);

export default Sucesso;

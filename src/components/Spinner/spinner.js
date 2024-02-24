import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import styles from './spinner.module.scss';

function Spinner(props) {
  const { size } = props;
  return (
    <div className={styles.spinner}>
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: size,
            }}
            spin
          />
        }
      />
    </div>
  );
}

export default Spinner;

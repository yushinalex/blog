import React from 'react';
import Alert from 'antd/es/alert/Alert';

import styles from './error-message.module.scss';

function ErrorMessage(props) {
  return (
    <div className={styles['error-wrapper']}>
      <Alert
        message={`OOPS! Something has gone wrong! Failed to load resource! ${props.error}.`}
        type="error"
        showIcon
      />
    </div>
  );
}

export default ErrorMessage;

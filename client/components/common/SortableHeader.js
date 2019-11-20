import React from 'react';
import { withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import { Link } from 'react-router-dom';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

let SortableHeader = props => {
  const { children, to, sortBy, currentLocation } = props;
  const queryCriteria = QueryString.parse(
    currentLocation ? currentLocation.search : ''
  );
  const filterIsActive =
    sortBy &&
    sortBy.toUpperCase() ===
      (queryCriteria.sortBy ? queryCriteria.sortBy.toUpperCase() : null);
  let nextSortDirection = 'ASC';
  let SortComponent;
  if (
    queryCriteria.sortDirection &&
    filterIsActive &&
    queryCriteria.sortDirection.toUpperCase() === 'ASC'
  ) {
    nextSortDirection = 'DESC';
    SortComponent = () => <FaSortAmountUp />;
  } else {
    SortComponent = () => <FaSortAmountDown />;
  }
  const url = `${to}?sortBy=${sortBy}&sortDirection=${nextSortDirection}`;

  if (!filterIsActive) {
    return (
      <span>
        {children}
        <span
          style={styles.sorterInactive}
          onClick={() =>
            props.history.push(`${to}?sortBy=${sortBy}&sortDirection=DESC`)
          }
        >
          <SortComponent />
        </span>
      </span>
    );
  }

  return (
    <span>
      {children}
      <Link to={url} style={styles.sorter}>
        <SortComponent />
      </Link>
    </span>
  );
};

const styles = {
  sorter: {
    cursor: 'pointer',
    padding: '0 0 0 6px',
    outline: 'none'
  },
  sorterInactive: {
    cursor: 'pointer',
    paddingLeft: '6px',
    color: 'gray'
  }
};

SortableHeader = withRouter(SortableHeader);

export { SortableHeader };

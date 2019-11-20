import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import QueryString from 'query-string';

import { 
    Pagination, PaginationItem, PaginationLink,
    ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem 
} from 'reactstrap';

class Paginator extends Component {

    state={
        showAmountFilter: false
    }

    limitAmountShown = (limit) => {
        const { location, history } = this.props;
        const parsedQueryString = QueryString.parse(location.search);
        parsedQueryString.limit = limit;
        parsedQueryString.page = 1;
        history.replace(`${location.pathname}?${QueryString.stringify(parsedQueryString)}`);
    }

    renderIncrements = () => {
        const { limit, increments=[25,50,100] } = this.props;
        return increments.map((inc, index) => {
            return (
                <DropdownItem key={index} disabled={limit === inc} onClick={() => this.limitAmountShown(inc)} style={styles.dropdownItem}>Show {inc}</DropdownItem>
            );
        });
    }

    renderShowAmountFilter = () => {
        const { limit } = this.props;
        return (
          <div style={styles.addMargin}>
            <ButtonDropdown isOpen={this.state.showAmountFilter} toggle={() => this.setState({showAmountFilter: !this.state.showAmountFilter})}>
              <DropdownToggle caret>Show {limit}</DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Show Amount</DropdownItem>
                {this.renderIncrements()}
              </DropdownMenu>
            </ButtonDropdown>
          </div>
        );
      }

    renderPagination = () => {
        const { 
            page, 
            pages, 
            limit, 
            location, 
            history 
        } = this.props;

        const parsedQueryString = QueryString.parse(location.search);
        // The page items to be rendered
        const pageItems = [];
        for(let i = 0; i < pages; i++) {
            let queryStringCopy = { ...parsedQueryString };
            queryStringCopy.page = i+1;
            queryStringCopy = QueryString.stringify(queryStringCopy);
            const path = `${location.pathname}?${queryStringCopy}`;
            pageItems.push(<PaginationItem key={i} active={i+1===page}><PaginationLink onClick={() => history.replace(path)}>{i+1}</PaginationLink></PaginationItem>)
        }
        const previousDisabled = page === 1;
        const nextDisabled = page === pages;
        const prevLink = `${location.pathname}?${QueryString.stringify({...QueryString.parse(location.search), page: page-1, limit})}`;
        const nextLink = `${location.pathname}?${QueryString.stringify({...QueryString.parse(location.search), page: page+1, limit})}`;
        return (
            <Pagination style={styles.pagination}>
            <PaginationItem>
                <PaginationLink previous disabled={previousDisabled} onClick={() => history.replace(prevLink)}/>
            </PaginationItem>
            {pageItems}
            <PaginationItem>
                <PaginationLink next disabled={nextDisabled} onClick={() => history.replace(nextLink)} />
            </PaginationItem>
            </Pagination>
        );
    }

    render() {
        return (
            <div style={styles.container}>
                <div>
                    {this.renderShowAmountFilter()}
                </div>
                <div>
                    {this.renderPagination()}
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        display: 'flex'
    },
    pagination: {
        margin: 0
    },
    dropdownItem: {
      cursor: 'pointer'
    },
    addMargin: {
      margin: '0 6px'
    }
}

Paginator = withRouter(Paginator);

export { Paginator }
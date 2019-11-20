import React, { Component } from 'react';
import { Input } from 'reactstrap';

class YearSelector extends Component {
  renderYearSelector = () => {
    const { availableYears, selectedYear } = this.props;
    if (selectedYear === null) {
      return null;
    }
    return (
      <Input
        type="select"
        name="year"
        value={selectedYear}
        onChange={e => this.props.selectYear(e.target.value)}
      >
        {availableYears.map((ay, index) => {
          if (index === 0) {
            return (
              <option default key={ay} value={ay}>
                {ay} (Current)
              </option>
            );
          }
          return (
            <option key={ay} value={ay}>
              {ay}
            </option>
          );
        })}
      </Input>
    );
  };

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <h3 style={{ paddingRight: '12px' }}>For Year</h3>
        <div style={{ flex: 1 }}>{this.renderYearSelector()}</div>
      </div>
    );
  }
}

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//actions
import * as AccountActions from '../../actions/AccountActions';

function mapStateToProps(state) {
  const { availableYears, selectedYear } = state.AccountsReducer;

  return {
    availableYears,
    selectedYear
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch);
}

YearSelector = connect(mapStateToProps, mapDispatchToProps)(YearSelector);

export { YearSelector };

'use strict';

import React, { Props } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

import Loading from '../../../shared/Loading';
import { fileClaim } from '../../api';

class ClaimPage extends React.Component {

  static get propTypes() {
    return {
      user: PropTypes.object,
      history: PropTypes.object.isRequired,
      match: PropTypes.shape({
        params: PropTypes.shape({
          contractUuid: PropTypes.string.isRequired
        })
      }).isRequired
    };
  }


  constructor(props) {
    super(props);

    this.state = { loading: false, isTheft: false, description: '',value:'no',medicament : '-----'};

    this.submit = this.submit.bind(this);
    this.setTheft = this.setTheft.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }




  submit() {
    const { isTheft, description } = this.state;
    const { history } = this.props;
    this.setState({ loading: true });
    fileClaim(this.props.user,
      this.props.match.params.contractUuid, { isTheft, description })
      .then(() => {
        history.push('/self-service/contracts');
        this.setState({ loading: false });
      }).catch(() => {
        this.setState({ loading: false });
        alert('Error occurred!');
      });
  }


  setTheft(event) {
    this.setState({ isTheft: !this.refs.theftField.checked });
  }

  setDescription({ target }) {
    this.setState({ description: target.value });
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    if(this.state.value === 'paracetamol'){
    this.setState({medicament : 'Panadol'});
    event.preventDefault();
      }
    if(this.state.value === 'med2'){
      this.setState({medicament : 'Treat2'});
      event.preventDefault();
    }
    if(this.state.value === 'no'){
      this.setState({medicament : '-----'});
      event.preventDefault();
    }
    
  }


  render() {
    const { loading, isTheft, description, } = this.state;
    const { user } = this.props;

    if (!user) {
      return (
        <Redirect to='/self-service' />
      );
    }

    return (
      <Loading hidden={!loading}>
        <div>
          <div className='ibm-columns'>
            <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1'>
              <h3 className='ibm-h3'><FormattedMessage id='File a Claim' /></h3>
            </div>
          </div>
          <div className='ibm-columns'>
            <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1'>
              <div className='ibm-column-form'>
                <p className='ibm-form-elem-grp'>
                  <label>
                    <FormattedMessage className='ibm-field-label' id='Fast Reimbursement offer' />:
                </label>
                  <span className='ibm-input-group'>
                    <input type='checkbox' ref='theftField'
                      className='ibm-styled-checkbox'
                      checked={isTheft} onChange={this.setTheft} />
                    <label className='ibm-field-label' htmlFor='theftField'
                      onClick={this.setTheft} />
                  </span>
                </p>
                <p>
                  <label><FormattedMessage id='Description' />:</label>
                  <span>
                    <textarea value={description}
                      onChange={this.setDescription} />
                  </span>
                </p>

                <p>
                  <form onClick={this.handleSubmit}>
                    <label>
                      Select your Allergie:
          <select value={this.state.value} onChange={this.handleChange}>
                        <option value="no">-----</option>
                        <option value="paracetamol">Paracetamol</option>
                        <option value="med2">Medicament 2</option>
                      </select>
                      <p></p>
                      <label>Midicine    </label>
                    </label>
                    <input value={this.state.medicament} />

                  </form>
                </p>
                <div id="root"></div>
                
              </div>
            </div>
          </div>
          <div className='ibm-columns'>
            <div className='ibm-col-2-1 ibm-col-medium-5-3 ibm-col-small-1-1 ibm-right'>
              <button type='button' className='ibm-btn-pri ibm-btn-blue-50'
                onClick={this.submit}><FormattedMessage id='Submit' /></button>
            </div>
          </div>
 
            

        </div>
      </Loading>


    );
  }
};

function mapStateToProps(state, ownProps) {
  return {
    user: state.userMgmt.user
  };
}

export default withRouter(connect(mapStateToProps)(ClaimPage));



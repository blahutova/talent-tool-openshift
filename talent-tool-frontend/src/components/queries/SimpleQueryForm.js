import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextInput from '../common/TextInput';

class SimpleQueryForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <form>
          <TextInput
            name="name"
            label="Name of your query"
            value={this.props.query.name}
            onChange={this.props.onChange}/>

            <input
             type="submit"
             disabled={this.props.saving}
             value={'Save'}
             className="btn btn-primary"
             onClick={this.props.onSave}/>
        </form>
      </div>
  );
  }
}

SimpleQueryForm.propTypes = {
  query: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default SimpleQueryForm;

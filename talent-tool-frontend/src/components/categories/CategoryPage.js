import React from 'react';
import {connect} from 'react-redux';
import * as categoryActions from '../../actions/categoryActions';
import * as translationActions from '../../actions/translationActions';
import translationApi from '../../api/translationApi';
import PropTypes from 'prop-types';
import { Button} from 'react-bootstrap';
import {bindActionCreators} from 'redux';
import CategoryForm from './CategoryForm';
import TranslationList from './TranslationList';
import CreateTranslationsList from './CreateTranslationsList';
import { withRouter } from 'react-router-dom';

class CategoryPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      category: this.props.category,
      translations: this.props.translations,
      languages: this.props.languages,
      languagesForTranslations: this.props.languagesForTranslations,
      saving: false,
      isEditing: false,
      authToken: this.props.authToken,
      isAdmin: this.props.isAdmin
    };

    this.toggleEdit = this.toggleEdit.bind(this);
    this.updateCategoryState = this.updateCategoryState.bind(this);
    this.saveCategory = this.saveCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  toggleEdit() {
    this.setState({isEditing: !this.state.isEditing})
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.category.id != nextProps.category.id) {
      this.setState({category: nextProps.category});
      this.setState({translations: nextProps.translations});
    }

    this.setState({saving: false, isEditing: false});
  }

  updateCategoryState(event) {
    const field = event.target.name;
    const category = this.state.category;
    category[field] = event.target.value;
    return this.setState({category: category});
  }

  saveCategory(event) {
    event.preventDefault();
    this.setState({saving: true});
    this.onUpdate();
    // this.props.actions.updateCategory(this.state.category);
    this.props.actions.updateCategory(this.state.category, this.state.authToken)
      .then(({ message }) => {
        this.props.handleCreating(message)
      });
  }

  onUpdate(){
    this.props.onCategoryUpdated(this.state.category);
  }

  deleteCategory(event) {
    this.props.onCategoryDeleted();
    this.props.actions.deleteCategory(this.state.category, this.state.authToken);
  }


  render() {
    if (this.state.isEditing) {
      return (
      <div>
        <h1>Edit Category</h1>
        <CategoryForm
          category={this.state.category}
          onSave={this.saveCategory}
          onChange={this.updateCategoryState}
          saving={this.state.saving} />
      </div>
      )
    }
    return(
      <div>
        <h1>{this.state.category.name}</h1>
        <p>{this.state.category.category_query}</p>
        {this.state.isAdmin &&
          <div>
            <Button onClick={this.toggleEdit}>Edit</Button>
            <Button onClick={this.deleteCategory}>Delete</Button>
          </div> }
        <TranslationList translations={this.props.translations} languages={this.props.languages} authToken={this.state.authToken} isAdmin={this.state.isAdmin}/>
        {this.state.isAdmin &&
          <CreateTranslationsList languages={this.props.languagesForTranslations}  category = {this.props.category}
          authToken={this.state.authToken}/>}
          <br/>
          <br/>
      </div>
    )
  }
}

CategoryPage.propTypes = {
  category: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  translations: PropTypes.array.isRequired
};

function collectCategoryTranslations(category, translations) {
  let selected = translations.map(translation => {
    if (category.id == translation.category_id) {
      return translation;
    }
  })
  return selected.filter(el => el != undefined)
}

function collectUnusedLanguages(languages, translations) {
  let selected = languages.map(language => {
    if (! isInTranslations(language.id, translations)) {
      return language;
    }
  })
  return selected.filter(el => el != undefined)
}

function isInTranslations(languageId, translations){
  let isThere = false;
  translations.map(translation => {
    if (translation.language_id == languageId) {
      isThere = true;
    }
  });
  return isThere;
}


function mapStateToProps(state, ownProps) {
  let category = {name: '', category_query: ''};
  // let authToken = state.authentication.token;
  let authToken = localStorage.getItem('token');
  let translations = [];
  let languages = state.languages;
  let languagesForTranslations = [];
  // let rolesOfUser = state.authentication.tokenParsed.realm_access.roles;
  let rolesOfUser = localStorage.getItem('roles');
  let isAdmin = (rolesOfUser.indexOf("app_admin") > -1);
  if (ownProps.category) {
    const id = ownProps.category.id;
    if (state.categories.length > 0) {
      category = Object.assign({}, state.categories.find(category => category.id == id))
      translations = collectCategoryTranslations(category, state.allTranslations);
      languagesForTranslations = collectUnusedLanguages(languages, translations);
    }
  }
  return {category: category, translations: translations, languages: languages,
    languagesForTranslations: languagesForTranslations, authToken: authToken, isAdmin: isAdmin};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(categoryActions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoryPage));

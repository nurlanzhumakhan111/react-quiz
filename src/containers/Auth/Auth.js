import React, {Component} from 'react'
import classes from './Auth.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'

import { connect } from 'react-redux';
import {auth} from '../../store/actions/auth'

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

class Auth extends Component {
  state = {
    isFormValid: false,
    formControls: {
      email: {
        value: '',
        type: 'email',
        label: 'email',
        errorMessage: 'Введите корректный email',
        valid: false,
        touched: false,
        validation: {
          required: 'true',
          email: true,
        }
      },
      password: {
        value: '',
        type: 'password',
        label: 'Пароль',
        errorMessage: 'Введите корректный пароль',
        valid: false,
        touched: false,
        validation: {
          required: 'true',
          minLength: 6,
        }
      }
    }
  }
  loginHandler = () => {
    this.props.auth(
      this.state.formControls.email.value,
      this.state.formControls.password.value,
      true
    )
  }

  registerHandler = () => {
    this.props.auth(
      this.state.formControls.email.value,
      this.state.formControls.password.value,
      false
    )
    
  }

  submitHandler = event => {
    event.preventDefault()
  }
  onChangeHandler(e, controlName){
    const formControls = {...this.state.formControls};
    const control = { ...formControls[controlName] };

    control.value = e.target.value;
    control.touched = true;
    control.valid = this.validateControl(control.value, control.validation);
    formControls[controlName] = control;
    let isFormValid = true;

    Object.keys(formControls).forEach(name => {
      isFormValid = formControls[name].valid && isFormValid;
    })
    this.setState({
      formControls, isFormValid
    })
  }
  validateControl(value, validation){
    if(!validation){
      return true
    } 
    let isVallid = true;
    if(validation.required){
      isVallid = value.trim() !== '' && isVallid
    }
    if(validation.email){
      isVallid = validateEmail(value) && isVallid
    }

    if(validation.minLength){
      isVallid = value.trim().length >= validation.minLength && isVallid;

    }
    return isVallid
    
  }
  renderInputs(){
    return Object.keys(this.state.formControls).map((controlName, index) => {
      const control = this.state.formControls[controlName];
      return (
        <Input 
          key={controlName + index}
          type={control.type}
          value={control.value}
          valid={control.valid}
          touched={control.touched}
          label={control.label}
          errorMessage={control.errorMessage}
          shouldValidate={!!control.validation}
          onChange={e => this.onChangeHandler(e, controlName)}
        />
      )
    })
  }
  render() {
    return (
      <div className={classes.Auth}>
        <div>
          <h1>Авторизация</h1>

          <form onSubmit={this.submitHandler} className={classes.AuthForm}>
            {this.renderInputs()}
            <Button
              type="success"
              onClick={this.loginHandler}
              disabled={!this.state.isFormValid}
            >
              Войти
            </Button>

            <Button
              type="primary"
              onClick={this.registerHandler}
              disabled={!this.state.isFormValid}

            >
              Зарегистрироваться
            </Button>
          </form>
        </div>
      </div>
    )
  }
}
function mapDispatchToProps(dispatch){
  return{
    auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin))
  }
}
export default connect(null, mapDispatchToProps)(Auth)
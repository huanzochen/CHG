import React from 'react'
import axios from 'axios'
import qs from 'querystring'

import NewWorldOAuth from '../auth/NewWorldOAuth'
import SideBtnList from '../../components/SideBtnList'
import Yahoo from '../components/Yahoo'



export default class NewWorld extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      googleOAuth:{
        authuser:'',
        code:'',
        prompt:'',
        scope:''
      },
      yahooOAuth:{
        code:''
      }
    }
    this.googleOAuthCheck = this.googleOAuthCheck.bind(this)
    this.googleOAuthExchange = this.googleOAuthExchange.bind(this)
    this.yahooOAuthCheck = this.yahooOAuthCheck.bind(this)
    this.yahooOAuthExchange = this.yahooOAuthExchange.bind(this)
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this)
  }

  componentDidMount() {
    if (this.props.location.search !== '' && this.props.location.pathname === '/oauth/google/callback') {
      this.googleOAuthCheck()
    }
    else if (this.props.location.search !== '' && this.props.location.pathname === '/oauth/yahoo/callback') {
      this.yahooOAuthCheck()
    }
  }

  googleOAuthCheck() {
    const googleOAuth = {}
    this.props.location.search.split('?')[1].split('&').map((param) => {
      googleOAuth[param.split('=')[0]] = decodeURIComponent(param.split('=')[1])
    })
    this.setState({googleOAuth}, this.googleOAuthExchange)
  }

  yahooOAuthCheck() {
    const yahooOAuth = {}
    this.props.location.search.split('?')[1].split('&').map((param) => {
      yahooOAuth[param.split('=')[0]] = decodeURIComponent(param.split('=')[1])
    })
    this.setState({yahooOAuth}, this.yahooOAuthExchange)
  }

  googleOAuthExchange() {
    const requestBody = {
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.REACT_APP_APP_URL}/oauth/google/callback`,
      code: this.state.googleOAuth.code,
      grant_type: 'authorization_code'
    }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    axios.post('https://oauth2.googleapis.com/token', qs.stringify(requestBody), config)
      .then(response => {
        console.log('response')
        console.log(response)
      })
      .catch(error => {
        console.dir('googleOAuthExchange 出現錯誤!')
        console.log(error)
      })
  }

  yahooOAuthExchange() {
    const requestBody = {
      client_id: process.env.REACT_APP_YAHOO_CLIENT_ID,
      client_secret: process.env.REACT_APP_YAHOO_CLIENT_SECRET,
      redirect_uri: `${process.env.REACT_APP_APP_URL}/oauth/yahoo/callback`,
      code: this.state.yahooOAuth.code,
      grant_type: 'authorization_code'
    }
    const config = {
      headers: {
        // 'Authorization': `Basic ENCODED(${btoa(process.env.REACT_APP_YAHOO_CLIENT_ID + ':' + process.env.REACT_APP_YAHOO_CLIENT_SECRET)})`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    axios.post('https://api.login.yahoo.com/oauth2/get_token', qs.stringify(requestBody), config)
      .then(response => {
        console.log('response')
        console.log(response)
        console.log('response.data')
        console.log(response.data)
      })
  }

  handleSuccessfulAuth(data) {
    this.props.handleLogin(data)
    this.props.history.push('/')
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div id="main" className="col-9">
            <h1 className="title display-3"><span className="badge badge-secondary">茉茉部落格</span></h1>
            <div className="inner">
              <div className="article">
                <div className="article_title">
                  <NewWorldOAuth handleSuccessfulAuth={this.handleSuccessfulAuth} />
                  <Yahoo />
                </div>
              </div>
            </div>
          </div>
          <div id="sidebar" className="col-3">
            <div className="inner">
              <nav id="menu">
                <SideBtnList />
              </nav>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import * as goFetch from '../axios/index'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

//comment for initial push to codegrade

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const token = localStorage.getItem('token');

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if(localStorage.getItem('token')){
      localStorage.removeItem('token');
      setMessage('Goodbye!')
      redirectToLogin();
    }
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setCurrentArticleId();
    setMessage('');
    setSpinnerOn(true);
    goFetch.login({username, password})
    .then(response => {
      setMessage(response.message);
      setSpinnerOn(false);
      redirectToArticles();
    })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);
    goFetch.getArticles(token)
    .then(response => {
      if(response.message) {
        setArticles(response.articles);
        setMessage(response.message);
      } else if(response === 401) {
        console.error("Resubmit for a token!");
        redirectToLogin();
      }
      setSpinnerOn(false);
    })
    .catch(err => console.error(err));
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true);
    goFetch.addArticle(token, article)
    .then(response => {
      setArticles([...articles, response.article]);
      setMessage(response.message);
      setSpinnerOn(false);
    })
  }

  const updateArticle = ( article_id, article ) => {
    // ✨ implement
    // You got this!
    setSpinnerOn(true);
    goFetch.editArticle(token, article, article_id)
    .then(response => {
      setArticles([
        ...articles.filter(item => item.article_id !== article_id), response.article
      ]);
      setMessage(response.message);
      setSpinnerOn(false);
    });
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setSpinnerOn(true);
    goFetch.deleteArticle(token, article_id)
    .then(response => {
      setArticles([
        ...articles.filter(item => item.article_id !== article_id)
      ]);
      setMessage(response.message);
      setSpinnerOn(false);
    });
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn={spinnerOn}/>
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
              currentArticleId={currentArticleId}
              updateArticle={updateArticle}
              postArticle={postArticle}
              setCurrentArticleId={setCurrentArticleId}
              articles={articles}
              />

              <Articles getArticles={getArticles}
              articles={articles}
              redirectToLogin={redirectToLogin}
              token={token}
              setCurrentArticleId={setCurrentArticleId}
              deleteArticle={deleteArticle} 
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}

import "./App.css"
import Link from "./components/Link"

function App() {
  return (
    <>
      <h1>Home Page</h1>
      <Link btnStyle path="/register">
        Register Page
      </Link>
      <Link btnStyle path="/login">
        Login Page
      </Link>
    </>
  )
}

export default App

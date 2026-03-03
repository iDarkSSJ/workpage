import "./App.css"
import Button from "./components/Button"
import Link from "./components/Link"
import { deleteAccountReq } from "./lib/authRequest"

function App() {
  return (
    <>
      {/* TEST ZONE*/}
      <h1>Home Page</h1>
      <Link btnStyle path="/register">
        Register Page
      </Link>
      <Link btnStyle path="/login">
        Login Page
      </Link>
      <Button btnType="danger" onClick={deleteAccountReq}>
        Delete account
      </Button>
    </>
  )
}

export default App

import React, { useState } from 'react'

const ForgotPassword = () => {
    const [email,setEmail] = useState("")
  return (
       <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          action="your_submit_url_here"
          method="post"
        >
          <h2 className="mb-4">Forgot Password</h2>
          <div className="mt-3">
            <label htmlFor="email_field" className="form-label">Enter Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <button
            id="forgot_password_button"
            type="submit"
            className="btn w-100 py-2"
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
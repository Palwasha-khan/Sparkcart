import React from 'react'

const UpdateUser = () => {
  return (
     <>
    <MetaData title={'Update User'}/>
    <AdminLayout>
         <div className="row wrapper">
      <div className="col-10 col-lg-8">
        <form className="shadow-lg">
          <h2 className="mb-4">Update User</h2>

          <div className="mb-3">
            <label for="name_field" className="form-label">Name</label>
            <input
              type="name"
              id="name_field"
              className="form-control"
              name="name"
              value=""
            />
          </div>

          <div className="mb-3">
            <label for="email_field" className="form-label">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value=""
            />
          </div>

          <div className="mb-3">
            <label for="role_field" className="form-label">Role</label>
            <select id="role_field" className="form-select" name="role" value="">
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <button type="submit" className="btn update-btn w-100 py-2">
            Update
          </button>
        </form>
      </div>
    </div>
    </AdminLayout>
     </>
  )
}

export default UpdateUser
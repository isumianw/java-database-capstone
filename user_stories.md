# User Story Template

**Title:**
_As a [user role], I want [feature/goal], so that [reason]._

**Acceptance Criteria:**
1. [Criteria 1]
2. [Criteria 2]
3. [Criteria 3]

**Priority:** [High/Medium/Low]
**Story Points:** [Estimated Effort in Points]
**Notes:**
- [Additional information or edge cases]

## Admin User Stories

**Admin Login:**
_As an admin, I want to log into the portal with my username and password, so that I can manage the platform securely._

**Acceptance Criteria:**

1. The login form accepts a valid username and password.
2. The system verifies credentials securely.
3. On success, the admin is redirected to the dashboard.
**Priority:** High
**Story Points:** 3
**Notes:**
- Invalid credentials should show an error message.

**Admin Logout:**
_As an admin, I want to log out of the portal, so that I can protect system access._

**Acceptance Criteria:**

1. Admin can logout from any page.
2. System invalidates the session
3. Admin is redirected to login page
**Priority:** High
**Story Points:** 1
**Notes:**
- Should automatically log out after inactivity

**Add Doctor:**
_As an admin, I want to add doctors, so that they can access and use the platform._

**Acceptance Criteria:**

1. Admin can fill a form to add doctor info.
2, System saves the doctor in the database.
3. Confirmation message is shown.
**Priority:** High
**Story Points:** 3
**Notes:**
- Validate required fields

**Delete Doctor:**
_As an admin, I want to delete a doctor's profile, so that I can manage staff records properly._

**Acceptance Criteria:**

1. Admin can see a list of doctors.
2. Admin can select and delete a doctor.
3. Deleted data is removed from the database.
**Priority:** Medium
**Story Points:** 3
**Notes:**
- Confirm before deletion

**Run Stored Procedure:**
_As an admin, I want to run a stored procedure in MySQL CLI to get the number of appointments per month, so that I can track usage statistics._

**Acceptance Criteria:**
1. Stored procedure exists and is callable.
2. It returns appointment counts grouped by month.
3. Results are used in admin reports.
**Priority:** Medium
**Story Points:** 2
**Notes:**
- Procedure should be optimized for performance

## Patient User Stories

**Patient Login:**
_As a patient, I want to log into the portal, so that I can manage my bookings._

**Acceptance Criteria:**
1. Login form is accessible.
2. Vallid credentials allow login.
3. Invalid login shows an error.

**Priority:** High
**Story Points:** 1
**Notes:**
- Use encrypted password storage

**Patient Logout**
_As a patient, I want to log out of the portal, so that I can secure my account._

**Acceptance Criteria:**
1. Logout button is visible on all pages.
2. Session is cleared after logout.
3. Redirects to homepage or login page.

**Priority:** High
**Story Points:** 1
**Notes:**
- Auto logout after inactivity recommended

**Patient Registration:**
_As a patient, I want to sign up using my email and password, so that I can book appointments._

**Acceptance Criteria:**
1. Patient can register using a form.
2. Email and password vallidation is enforced.
3. System stores user in the database.

**Priority:** High
**Story Points:** 2
**Notes:**
- Avoid duplicate email registrations

**Book Appointment:**
_As a patient, I want to book an hour-long appointment with a doctor, so that I can consult them._

**Acceptance Criteria:**
1. Patient can choose data, time, and doctor.
2. Booking is confirmed if the slot is available.
3. Appointment is stored in database.

**Priority:** High
**Story Points:** 3
**Notes:**
- Prevent double-booking of same slot

**View Doctors Without Login:**
_As a patient, I want to view doctors without logging in, so that I can explore options before registering._

**Acceptance Criteria:**
1. Patient can access the doctor list publicly.
2. Doctor list includes name, specialization, and availability.
3. No personal details are required to view

**Priority:** Medium
**Story Points:** 2
**Notes:**
- Should be accessible from homepage or main menu

## Doctor User Stories

**Doctor Login:**
_As a doctor, I want to log into the portal, so that I can manage my appointments._

**Acceptance Criteria:**
1. Doctor can access the login page.
2. Valid login grants access to doctor dashboard.
3. Invalid credentials return an error.

**Priority:** High
**Story Points:** 1
**Notes:**
- Secure login with email and password

**Doctor Logout**
_As a doctor, I want to log out of the portal, so that I can protect my data._

**Acceptance Criteria:**
1. Doctor can log out from any page.
2. Session is cleared after logout.
3. Redirected to login or home.

**Priority:** High
**Story Points:** 1
**Notes:**
- Auto-logout on inactivity is recommended.

**Mark Unavailability:**
_As a doctor, I want to mark my unavailability, so that patients can only book from my available slots._

**Acceptance Criteria:**
1. Doctor can select unavailable time slots.
2. These slots become unbookable to patients.
3. Changes are reflected in real-time.

**Priority:** High
**Story Points:** 3
**Notes:**
- Prevent appointments from being made during these times.

**Update Doctor Profile:**
_As a doctor, I want to update my profile with specialization and contact information, so that patients have up-to-date information._

**Acceptance Criteria:**
1. Editable form for name, contact, and specialization.
2. Changes are saved and shown to patients.
3. System validates required fields.

**Priority:** Medium
**Story Points:** 2
**Notes:**
- Display updated info on doctor listing page

**View Patient Details for Appointments:**
_As a doctor, I want to view patient details for upcoming appointments, so that I can be prepared._

**Acceptance Criteria:**
1. Each appointment has a link to patient details.
2. Shows name, age, reason for visit, and past notes.
3. Accessible only to the assigned doctor.

**Priority:** Medium
**Story Points:** 3
**Notes:**
- Ensure data privacy rules are followed

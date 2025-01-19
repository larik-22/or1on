# Test report

Here you can find the results of the tests that were executed.<br>
Tester: Rafael Tavares, Botond Vendler 😎, Sarina Bameriniya <br>
Date: 17-01-2025<br>

## Test Case 1
Name: User can log in. <br>
Status: Success

Step 1 - User starts by clicking the Login button on the navbar.

![alt_text](img/test_cases/login_case1_step1.png)<br>

Step 2 - User enters their correct login information into the correct fields.

![alt_text](img/test_cases/login_case1_step2.png)<br>

Step 3 - User finishes by clicking Login button on the login page.

![alt_text](img/test_cases/login_case1_step3.png)<br>

After these 3 steps the user is successfully logged in.

![alt_text](img/test_cases/login_case1_result.png)<br>


## Test Case 2
Name: User can't log in with incorrect password. <br>
Status: Success

Step 1 - User starts by clicking the Login button on the navbar.

![alt_text](img/test_cases/login_case1_step1.png)<br>

Step 2 - User enters their correct email but incorrect password into the correct fields.

![alt_text](img/test_cases/login_case1_step2.png)<br>

Step 3 - User finishes by clicking Login button on the login page.

![alt_text](img/test_cases/login_case1_step3.png)<br>

After these 3 steps the user isn't logged in and the site displays a warning.

![alt_text](img/test_cases/login_case2_result.png)<br>

## Test Case 3
Name: User can't log in with invalid password. <br>
Status: Success


Step 1 - User starts by clicking the Login button on the navbar.

![alt_text](img/test_cases/login_case1_step1.png)<br>


Step 2 - User enters their correct email but invalid password into the correct fields.

![alt_text](img/test_cases/login_case1_step2.png)<br>

Step 3 - User finishes by clicking Login button on the login page.

![alt_text](img/test_cases/login_case1_step3.png)<br>

After these 3 steps the user isn't logged in and the site displays a warning.

![alt_text](img/test_cases/login_case3_result.png)<br>

### Test Case 4
Name: User can't log in with invalid email. <br>
Status: Success

Step 1 - User starts by clicking the Login button on the navbar.

![alt_text](img/test_cases/login_case1_step1.png)<br>

Step 2 - User enters their invalid email but correct password into the correct fields.

![alt_text](img/test_cases/login_case4_step2.png)<br>

Step 3 - User finishes by clicking Login button on the login page.

![alt_text](img/test_cases/login_case1_step3.png)<br>

After these 3 steps the user isn't logged in and the site displays a warning.

![alt_text](img/test_cases/login_case4_result.png)<br>

## Test Case 5
Name: User can suggest a new highlight. <br>
Status: Success

Sept 1 - User starts by clicking in the suggest highlight tab in the navigation bar.

![alt text](img/test_cases/suggest-highlight1.png)<br>

Sept 2 - User enters the form and needs to fill all information.

![alt text](img/test_cases/suggest-highlight2.png)<br>

Sept 3 - User chooses the location from the map.

![alt text](img/test_cases/suggest-highlight3.png)<br>

Sept 4 - After all fields are completed user can submit the request.

![alt text](img/test_cases/suggest-highlight4.1.png)<br>

After all 4 steps user is done by requesting for a new highlight.

## Test Case 6
Name: User can change their username <br>
Status: Success

Sept 1 - User starts by clicking on the User dashboard tab in the navigation bar.

![alt text](img/test_cases/userdashboard-1-bar.png)<br>

Step 2 - User clicks on the change username tab in the navigation bar.

![alt text](img/test_cases/userdashboard-2-options-userdashboard.png)<br>

Step 3 - User fills in the form by putting their new username.

![alt text](img/test_cases/userdashboard-6-changeUsername.png)<br>

Step 3 - User sees the success message for changing their username.

![alt text](img/test_cases/userdashboard-7-changeUsername-success.png)<br>

Step 4 - After all 3 steps user is done by changing their username.

![alt text](img/test_cases/userdashboard-8-changeusername-after.png)<br>

## Test Case 7
Name: User can't change their password if it's not more than 4 characters long.<br>
Status: Success

Sept 1 - User starts by putting a username that is less than 5 characters long.

![alt text](img/test_cases/userdashboard-9-changeusername-error.png)<br>

after this step user cannot change their username and a warning is shown. 

## Test Case 8
Name: User can change their password<br>
Status: Success

Step 1 - User clicks on change password in user dashboard and encounter the form for filling the required areas for changing password.

![alt text](img/test_cases/userdashboard-3-changePassword.png)<br>

Step 2 - User clicks on submit after filling current and new password. They encounter with the success message. 

![alt text](img/test_cases/userdashboard-4-changePassword-sucess.png)<br>

After these steps, user's password is successfully changed.

## Test Case 9
Name: User cannot change their password if current password does not match OR new password do not match<br>
Status: Success

step 1 - User enters an invalid current password.

![alt text](img/test_cases/userdashboard-5-changePassword-error.png)<br>

Step 2 - User enters invalid new passwords without using an Uppercase at the beginning of the password.

![alt text](img/test_cases/userdashboard-changePassword-error2.png)<br>

After doing these steps, user cannot change their password.

## Test Case 10
Name: User can log out<br>
Status: Success

Step 1 - User clicks on logout in user dashboard navigation bar.

![alt text](img/test_cases/userdashboard-10-logout.png)<br>

Step 2 - User clicks on Logout button until they encounter the confirmation of their request.

![alt text](img/test_cases/userdashboard-11-logout-confirmation.png)<br>

After these steps user will successfully log out and redirect to the login page. 






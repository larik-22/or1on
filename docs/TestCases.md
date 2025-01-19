# Test report

## Traceability matrix

### Functional

The table below shows an overview of which test covers which functional requirements

| Test | RFU-08 | SR-19 | RFU-11 | SR-14 | F5 | F6 | F7 | F8 | F9 | F10 | 
|:----:|:------:|:-----:|:------:|:-----:|:--:|:--:|:--:|:--:|:--:|:---:|
|  T1  |   X    |       |        |       |    |    |    |    |    |     | 
|  T2  |   X    |       |        |       |    |    |    |    |    |     |
|  T4  |   X    |       |        |       |    |    |    |    |    |     |
|  T5  |        |       |        |       |    |    |    |    |    |     |  
|  T6  |   X    |       |        |       |    |    |    |    |    |     |
|  T7  |   X    |       |        |       |    |    |    |    |    |     |
|  T8  |   X    |   X   |        |       |    |    |    |    |    |     | 
|  T9  |   X    |       |        |       |    |    |    |    |    |     |
| T10  |   X    |       |        |       |    |    |    |    |    |     |
| T11  |        |       |   X    |   X   |    |    |    |    |    |     |
| T12  |        |       |   X    |   X   |    |    |    |    |    |     |  
| T13  |        |       |   X    |   X   |    |    |    |    |    |     |
| T14  |        |       |   X    |   X   |    |    |    |    |    |     |
| T15  |        |       |        |       |    |    |    |    |    |     | 
| T16  |        |       |        |       |    |    |    |    |    |     |
| T17  |        |       |        |       |    |    |    |    |    |     |
| T18  |        |       |        |       |    |    |    |    |    |     |
| T19  |        |       |        |       |    |    |    |    |    |     |  
| T20  |        |       |        |       |    |    |    |    |    |     |
| T21  |        |       |        |       |    |    |    |    |    |     |

### Non funtional

The table below shows an overview of which test covers which non-functional requirements

##### Unst = (untestable) not able to test it.

| Test | SR_19 | NF2 | NF3 | NF4 | NF5 | NF6 | NF7 | NF8 | NF9 | NF10 | NF11 | NF12 | NF13 | NF14 | NF15 | NF16 | NF17 | NF18 | NF19 | 
|:----:|:-----:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
|  T1  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
|  T2  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
|  T4  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
|  T5  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
|  T6  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
|  T7  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
|  T8  |   X   |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
|  T9  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
| T10  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
| T11  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
| T12  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
| T13  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
| T14  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
| T15  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
| T16  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
| T17  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
| T18  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
| T19  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
| T20  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |
| T21  |       |     |     |     |     |     |     |     |     |      |      |      |      |      |      |      |      |      |      |

Here you can find the results of the tests that were executed.<br>
Tester: Rafael Tavares, Botond Vendler, Sarina Bameriniya, Jan <br>
Date: 17-01-2025<br>

----------------------------------------------------

# Test cases for a Non-admin user

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

Step 1 - User clicks on change password in user dashboard and encounter the form for filling the required areas for
changing password.

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


---------------------------------------------------

# Test cases for Moderator

## Test Case 11

Name: Moderator can manage highlights<br>
Status: Success

Step 1 - Moderator starts by clicking on the moderator dashboard on the nav bar.

![alt text](img/test_cases/moderatordashboard.png)<br>

Step 2 - Moderator clicks on highlights then on the Manage bar.

![alt text](img/test_cases/moderator-highlightManage1.png)<br>

## Test Case 12

Name: Moderator can edit highlights<br>
Status: Success

Step 1 - Moderator clicks on edit button.

![alt text](img/test_cases/moderator-highlightsManage2-edit.png)<br>

Step 2 - Moderator edits the required data then clicks on the confirm button to save the updated data.

![alt text](img/test_cases/moderator-highlightsManage3-edit-confirm.png)<br>

After all these steps moderator can see the result of edited data on the table.

![alt text](img/test_cases/moderator-highlightsManage4-edit-result.png)<br>

## Test Case 13

Name: Moderator can add new highlights<br>
Status: Success

Step 1 - Moderator starts by clicking on the add highlight button in manage highlights page.

![alt text](img/test_cases/moderator-highlightsManage5-add-button.png)<br>

step 2 - Moderator fills in accurate data for adding a new highlight then clicks on the confirm button. (make sure to
add none for business description if it is not needed).

![alt text](img/test_cases/moderator-highlightsManage6-add-confirm.png)<br>

Step 3 - Moderator can check the newly added highlight in the table as well as the map.

![alt text](img/test_cases/moderator-highlightsManage7-add-result.png)<br>

After all these steps moderator can see the result of newly added data on the table.

## Test Case 14

Name: Moderator can delete highlight.<br>
Status: Success

Step 1 - Moderator clicks on the delete button for the to-be-deleted highlight.

![alt text](img/test_cases/moderator-highlightsManage8-delete-button.png)<br>

Step 2 - Moderator clicks on the "Yes" button to confirm the elimination of the selected highlight.

![alt text](img/test_cases/moderator-highlightsManage9-delete-confirmation.png)<br>

After all these steps moderator can see the result of the deleted highlight on the table.

## Test Case 15

Name: Moderator can manage highlight suggestions<br>
Status: Success

Step 1 - Moderator starts by clicking on the Suggestions in the moderator dashboard's nav bar.

![alt text](img/test_cases/moderator-highlightSuggestion1.png)<br>

## Test Case 16

Name: Moderator can Accept a highlight suggested by a non-admin user.<br>
Status: Success

Step 1 - Moderator clicks on the "Accept" button for the selected highlight from user.

![alt text](img/test_cases/moderator-highlightSuggestion2-accept.png)<br>

Step 2 - Moderator clicks on "Yes" button to once more confirm the highlight.

![alt text](img/test_cases/moderator-highlightSuggestion3-confirm.png)<br>

Step 3 - Moderator goes to highlight management page to check the accepted highlight.
![alt text](img/test_cases/moderator-highlightSuggestion4-result.png)<br>

After all these steps moderator can accept the suggested highlight from user and add it to all highlights. They can also
check it on the map.

## Test Case 17

Name: Moderator can reject a highlight suggested by a non-admin user.<br>
Status: Success

Step 1 - Moderator clicks on the "Reject" button for the selected highlight from user.

![alt text](img/test_cases/moderator-highlightSuggestion5-reject.png)<br>

Step 2 - Moderator clicks on "Yes" button to once more confirm rejecting the highlight.

![alt text](img/test_cases/moderator-highlightSuggestion6-reject-confirm.png)<br>

After all these steps moderator can see the state of rejecting a highlight on the table.

![alt text](img/test_cases/moderator-highlightSuggestion7-reject-result.png)<br>

## Test Case 18

Name: Administrator can manage tours<br>
Status: Success

Step 1 - Administrator starts by clicking on the Manage Tours tab in the navigation bar.

![alt text](img/test_cases/pic_1.png)<br>

Step 2 - Administrator can see all the tours and can edit, delete or add new tours.

![alt text](img/test_cases/pic_2.png)<br>

## Test Case 19

Name: Administrator can edit tours<br>
Status: Success

Step 1 - Administrator starts by clicking edit button on the tour they want to edit.

![alt text](img/test_cases/pic_3.png)<br>

Step 2 - Administrator can edit the tour and save the changes.

![alt text](img/test_cases/pic_4.png)<br>

## Test Case 20

Name: Administrator can delete tours<br>
Status: Success

Step 1 - Administrator starts by clicking delete button on the tour they want to delete.

![alt text](img/test_cases/pic_5.png)<br>

## Test Case 21

Name: Administrator can add tours<br>
Status: Success

Step 1 - Administrator starts by clicking add tour button.

![alt text](img/test_cases/pic_6.png)<br>

Step 2 - Administrator can fill the form and add the new tour.

![alt text](img/test_cases/pic_7.png)<br>
![alt text](img/test_cases/pic_8.png)<br>
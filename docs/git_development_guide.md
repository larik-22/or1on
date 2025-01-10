
# Workflow Instructions for the Team

1. **Ticket Numbering**  
   Tickets should be numbered in the format: `ORN-xxx`

2. **Pull the Latest Changes**  
   When you pick a ticket, update the local project by running:  
   ```bash
   git pull
   ```

3. **Create a New Branch**  
   Checkout from `develop` into a new branch, naming it the same as the ticket (e.g., `ORN-001`):  
   ```bash
   git checkout -b ORN-001
   ```

4. **Make Changes and Stage Them**  
   After making changes, stage them using:  
   ```bash
   git add -u
   ```

5. **Commit Changes**  
   Add an informational commit message:  
   ```bash
   git commit -m "Your commit message here"
   ```

6. **Push the Branch**  
   Push your branch to the repository:  
   ```bash
   git push
   ```

7. **Create a Merge Request**  
   Create a merge request into the `develop` branch.

8. **Request a Code Review**  
   Assign someone as a reviewer and post a request for review in the Discord channel.

9. **Make Changes if Needed**  
   If feedback is provided during the review, make necessary changes and update the commit.

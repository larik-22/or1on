# Introduction

Deventer, a city rich in history, culture, and charm, seeks to become a must-visit destination for
tourists and a source of pride for its residents. To achieve this, the proposed project aims to create a
web-based application that enhances the city's appeal, fosters deep exploration, and provides
interactions with its highlights. This platform will serve as a guide for exploring Deventer, offering
themed tours, interactive features, and accessibility options to cater to a diverse audience.
By GPS pathfinding technology, user-generated feedback, and real-time recommendations, the
project aligns with the goal of making Deventer an unforgettable experience. Whether exploring
historical landmarks, scenic nature trails, or vibrant cultural hotspots, this initiative will create
opportunities for engagement, learning, and enjoyment for everyone—residents, tourists, and
businesses alike.

# Business goals

The following business goals outline the foundation for this vision, emphasizing accessibility, user
engagement, and promoting Deventer.
The main business goals of the project are:

#### Design for Simplicity

- Use a clean, responsive interface that adapts seamlessly to devices of all sizes (smartphones,
  tablets, desktops). Implement navigation with minimal clicks to access tours, highlights, and user
  feedback.

#### Promote Deventer and its Beauty

- Enhance the attractiveness of Deventer for residents and tourists alike improving access to cultural,
  historical, and recreational opportunities in the city.

#### Encourage Deep Exploration of the City

- Offer tools and features that help users explore the city in detail providing guided tours that highlight
  diverse themes, such as history, nature, and architecture.

#### Ensure Accessibility and Inclusivity

- Make the app user-friendly for all demographics, including youth, older individuals, students, and
  people with disabilities. (e.g. including adjustable features like font size and color contrast for better
  accessibility)

#### Leverage Technology for a Superior Experience

- Utilize GPS and pathfinding tools to help users navigate the city and find nearby highlights enabling
  real-time interaction with highlights, including grading and commenting.

#### Encourage Engagement and Community Building

- Allow users to leave feedback, grade highlights, and suggest new additions empowering moderators
  to maintain content quality and manage feedback.

#### Provide Context and Enrichment:

- Share detailed and various informations such as stories, history, images, and articles about the
  highlights to educate users.
  Tailor recommendations based on user preferences and historical data.

#### Promote Local Businesses:

- Offer special promotions and deals at highlight locations to boost local commerce.

# System context diagram

![context.png](img%2Fcontext.png)

- Or1on remains the central system providing core functionalities.
- Visitor interacts with the application to select tours, rate highlights, and add feedback.
- Moderator uses the app to manage content, approve feedback, edit stories, and moderate ratings.
- GPS System provides location data to show users their position and nearby highlights for navigation.
- Third-party Maps API supplies mapping data and routing capabilities for displaying highlights and paths.

# Requirements

## Business requirements

| Req.#  | Description                                                                                              | F/NF | MoSCoW | Source     |
|--------|----------------------------------------------------------------------------------------------------------|------|--------|------------|
| BR-001 | The application SHOULD be web based                                                                      | NF   | MUST   | Appendix B |
| BR-002 | The application SHOULD improve access to cultural, historical and recreational opportunities in the city | NF   | MUST   | Appendix B |
| BR-003 | The application SHOULD share information about the highlights                                            | NF   | MUST   | Appendix B |
| BR-004 | The application SHOULD offer special promotions at highlights                                            | NF   | MUST   | Appendix A |
| BR-005 | The application SHOULD be accessible for everyone                                                        | NF   | MUST   | Appendix A |
| BR-006 | The application SHOULD provide guided tours                                                              | NF   | MUST   | Appendix B |

## User and system requirements

### User requirements

| Req.#  | Description                                                                                                                                                                                | F/NF | MoSCoW | Source     |
|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|--------|------------|
| RFU-01 | As a user, I want to submit feedback on each highlight to share my honest opinion based on my visit.                                                                                       | F    | MUST   | Appendix B |
| RFU-02 | As a user, I want to see feedback from others on each tour and highlight, including ratings, comments, and photos, to better plan my experience.                                           | F    | MUST   | Appendix A |
| RFU-03 | As a user, I want the ability to moderate my own comments and ratings so I can update or correct my feedback based on new information or experiences.                                      | F    | SHOULD | Appendix A |
| RFU-04 | As a user, I want the app to provide me with the shortest walking/biking routes along with the estimated time to the destination to make my tour efficient and enjoyable.                  | F    | MUST   | Appendix A |
| RFU-05 | As a user, I want to have access to accessibility functions such as audio guidance and adjustable font size to ensure the app is user-friendly for people of all abilities.                | F    | SHOULD | Appendix A |
| RFU-06 | As a user, I want to filter tours and highlights based on color on the map to quickly identify attractions that match my interests.                                                        | F    | MUST   | Appendix A |
| RFU-07 | As a user, I want to be able to choose my preferred language in the app to ensure I can understand and fully use the app’s features.                                                       | F    | COULD  | Appendix A |
| RFU-08 | As a user, I want to log in, register, and reset my password if needed so I can securely manage my account and access personalized features.                                               | F    | MUST   | Appendix B |
| RFU-10 | As a moderator, I want to review comments and ratings before they are published to ensure fairness and, if necessary, suspend users for inappropriate feedback.                            | F    | MUST   | Appendix B |
| RFU-11 | As a moderator, I want the ability to add, edit and delete highlights and tours within the app to keep the information accurate and up-to-date.                                            | F    | MUST   | Appendix B |
| RFU-13 | As a moderator, I want to approve or reject new highlights suggested by trusted users based on photos or audio they submit to ensure the quality and relevance of added content.           | F    | MUST   | Appendix A |
| RFU-14 | As a business owner, I want to be able to add my own highlight through posting an ad in the app to attract visitors and promote my business.                                               | F    | COULD  | Appendix A |
| RFU-15 | As a user, I want to see business offers (e.g., discounts or free items) when visiting a particular location to make the experience more rewarding and enjoyable.                          | F    | COULD  | Appendix A |

### System requirements

| Req.#  | Description                                                                             | F/NF | MoSCoW | Source     |
|--------|-----------------------------------------------------------------------------------------|------|--------|------------|
| SR-001 | The system SHOULD display a map of the user's surroundings                              | F    | MUST   | Appendix B |
| SR-002 | The system SHOULD allow users to zoom in and out of the map                             | F    | MUST   | Appendix A |
| SR-003 | The system SHOULD display all highlights on the map                                     | F    | MUST   | Appendix A |
| SR-004 | The system SHOULD allow users to select pre-made tours                                  | F    | MUST   | Appendix A |
| SR-005 | The system SHOULD allow users to create accounts and log in                             | F    | MUST   | Appendix A |
| SR-006 | The system SHOULD allow users to add ratings to all highlights                          | F    | MUST   | Appendix B |
| SR-007 | The system SHOULD allow users to add comments to all highlights                         | F    | MUST   | Appendix B |
| SR-008 | The system SHOULD allow users to suggest new map highlights                             | F    | MUST   | Appendix A |
| SR-009 | The system SHOULD allow moderator users to accept, deny or edit ratings and comments    | F    | MUST   | Appendix B |
| SR-010 | The system SHOULD allow moderator users to accept or deny highlight suggestions         | F    | MUST   | Appendix B |
| SR-011 | The system SHOULD allow moderator users to mark users as trustworthy                    | F    | SHOULD | Appendix A |
| SR-014 | The system SHOULD allow moderator users to add new highlights and tours                 | F    | MUST   | Appendix A |
| SR-016 | The system SHOULD allow business highlights to contain promotions                       | F    | COULD  | Appendix A |
| SR-017 | The system SHOULD allow users to edit or remove their own ratings and comments          | F    | MUST   | Appendix A |
| SR-018 | The system SHOULD allow users to switch between languages                               | F    | COULD  | Appendix A |
| SR-019 | The system SHOULD allow users to edit their passwords                                   | F    | MUST   | Appendix A |
| SR-020 | The system SHOULD display different types of highlights with different indicators       | F    | MUST   | Appendix A |
| SR-021 | The system SHOULD allow trustworthy users to post ratings and comments without approval | F    | SHOULD | Appendix A |
| SR-022 | The system SHOULD automatically determine a path between highlights within tours        | F    | SHOULD | Appendix A |
| SR-023 | The system SHOULD automatically determine a timeframe for each tour                     | F    | SHOULD | Appendix A |
| SR-024 | The system MUST use Open Street Maps.                                                   | NF   | MUST   | Appendix A |
| SR-025 | The system MUST use GPS to determine user location.                                     | NF   | MUST   | Appendix B |
| SR-026 | The system MUST be a web-based application.                                             | NF   | MUST   | Appendix B |
| SR-027 | The system MUST run on any kind of device that has a sense of location.                 | NF   | MUST   | Appendix B |
| SR-028 | The system MUST use PostgresSQL for storing data of the app.                            | NF   | MUST   | Appendix A |
| SR-029 | The system MUST use Hono as a backend for the app.                                      | NF   | MUST   | Appendix A |
| SR-030 | The system MUST use Svelte for the front end of the app.                                | NF   | MUST   | Appendix A |
| SR-031 | The system MUST be written in HTML, CSS, TypeScript and Svelte.                         | NF   | MUST   | Appendix A |
| SR-032 | The system MUST have a screen reader.                                                   | NF   | MUST   | Appendix A |
| SR-033 | The system MUST use accessibility friendly typography.                                  | NF   | MUST   | Appendix A |
| SR-034 | The system MUST have options for colors with different contrasts.                       | NF   | MUST   | Appendix A |

# Wireframes

### Admin

![admin_panel.png](img%2Fadmin_panel.png)

### Highlights

![highlights.png](img%2Fhighlights.png)

### Map

![map.png](img%2Fmap.png)

### Review

![review.png](img%2Freview.png)

# Appendix A: The Interview

### Core features of the app

- The web app can suggest the shortest walking or biking routes and provide estimated travel times to
  the destinations.
- Tours can be categorized based on the type, name, and description, offering a variety of interests for
  users.
- Tours include a list of places worth visiting, with highlights organized in a logical order.
- Each highlight will feature feedback from trusted users, including ratings, comments, and
  potentially (COULD) photos and audio.
- Users can view feedback from others about each tour and highlight. They can moderate their own
  comments and ratings.
- Users might have the option to create personalized highlights (COULD).
- The map will allow users to zoom in, and highlights or tours can be filtered based on color.
- The app will include accessibility features such as audio guides (COULD) and adjustable font sizes.

### User and Business Interactions

- For business purposes, the app can suggest promotions or offers when visiting a place (for example,
  pubs offering a free beer).
- Businesses may also be able to add their own highlights by posting ads (COULD).
- Users who are logged in can gain trust by providing fair feedback. Over time, they can comment and
  rate highlights without needing moderation.
- Trusted users can suggest new highlights (through photos or audio), which the moderator can
  review and decide whether to add.
- Users can create accounts, log in, reset passwords, and have their accounts suspended by
  moderators if necessary. Suspicious accounts can be suspended by moderators.
- Users can choose their preferred language for the web app (COULD).

### Moderator Features and Controls

- Moderators can review and approve comments, ratings, and user accounts. They also have the
  ability to edit or remove highlights and tours.
- If a user's behavior is inappropriate, the moderator can block their account, and the user will be
  notified during login that their account has been blocked due to...

### Technical Aspects and Data

- The app will use the free version of Google Maps for navigation and GPS tracking. If GPS is
  unavailable, QR codes around the city might be used (though this is not ideal).
- Dummy data will be provided during the initial phases, and in Sprint 2, a list of highlights and tours
  will be given for use in the web app.

### Additional Features

- The app will have detection for inappropriate behavior or misuse.
- The web app is designed to be accessible for users ranging from ages 10 to 80.

# Appendix B: The letter

![letter.png](img%2Fletter.png)
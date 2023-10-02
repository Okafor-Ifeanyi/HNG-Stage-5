## HNG Stage 5 Backend - Develop a Chrome Extension Video uploader and Transcriber

# Node.js Multer Express MongoDB CRUD API Blob

A simple REST API for CRUD operations to recieve streamed videos save them in chunks the finalize the video compilation then send the video-url to the compiled video. Resources using Node.js, Multer, Blob, Express, MongoDB, and Mongoose.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- IDE- Vscode or any suitable.
- Node.js and npm installed.
- MongoDB installed and running.
- Postman or a similar tool for API testing.

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Okafor-Ifeanyi/HNG-Stage-5
   ```

2. Change to the project directory:

    ```bash
    cd your-api-repo
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

### Environment Variables

- Create a .env file in the root directory of your project and add the following environment variables:
    ``` bash
    MONGO_URI= ? your_mongodb_uri_here  
    PORT= ? your_desired_port_here
    DEEPGRAM_API_KEY= ? your_desired_port_here
    ```
MONGO_URI=your_mongodb_uri_here  
PORT=your_desired_port_here
 DEEPGRAM_API_KEY= ? your_desired_port_here

## API Endpoints
- **Create a new session**:  `POST /api/createSession`

- **Upload video CHunk to session**:  `POST /api/createSession`

- **finalize session**:  `POST /api/finalize-session`

- **Get specific Session by sessionID**:  `GET /api/:info`

- **Get all Session Video URL**:   `PATCH /api/:id`


## Testing
Use Postman or your preferred API testing tool to test the CRUD operations. Here's a sample Postman collection you can import: Postman Collection.
>   [Render Live](https://hng-stage-5-mexq.onrender.com)

## Documentation
This Docs contains an extensive documentation with the following features
- Standard formats for requests and responses for each endpoint.
- Sample usage of the API, including example requests and expected responses.
- Any known limitations or assumptions made during development.
- Instructions for setting up and deploying the API locally or on a server.
>   [Postman Docs](https://documenter.getpostman.com/view/19026826/2s9YJbzMgi)

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## License
This project is licensed under the MIT License.

> Copyright (c) 2023 Prog BIO
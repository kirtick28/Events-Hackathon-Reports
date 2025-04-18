<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/your_username/hackathon-event-reports">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Hackathon Event Reports</h3>

  <p align="center">
    A full-stack platform for managing and submitting hackathon event reports
    <br />
    <a href="https://github.com/your_username/hackathon-event-reports"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://yourapp.com">View Demo</a>
    &middot;
    <a href="https://github.com/your_username/hackathon-event-reports/issues">Report Bug</a>
    &middot;
    <a href="https://github.com/your_username/hackathon-event-reports/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Hackathon Event Reports is a comprehensive platform that enables:

- Secure user authentication with JWT
- Event report submission and management
- File uploads to AWS S3 storage
- Email notifications and password reset functionality
- Role-based access control
- RESTful API architecture

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

[![MongoDB][MongoDB-shield]][MongoDB-url]
[![Express][Express-shield]][Express-url]
[![React][React-shield]][React-url]
[![Node][Node-shield]][Node-url]
[![AWS][AWS-shield]][AWS-url]
[![JWT][JWT-shield]][JWT-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- AWS Account (for S3 storage)
- MongoDB Atlas account
- Gmail account (for email service)

### Installation

1. Clone the repo

```
git clone https://github.com/your_username/hackathon-event-reports.git
```

2. Install server dependencies

```
cd server
npm install
```

3. Install client dependencies

```
cd client
npm install
```

4. Set up environment variables

Create `.env` file in server directory:

```
# MongoDB
MONGODB_URI=your_mongodb_atlas_url

# JWT
JWT_SECRET=your_secret_code
JWT_RESET_SECRET=your_reset_secret_code
JWT_EXPIRES_IN=1d

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name

# Server
PORT=8000
NODE_ENV=development

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@hackreports.com
CLIENT_URL=http://localhost:3000

# Password Hashing
BCRYPT_SALT_ROUNDS=10
```

Create `.env` file in client directory:

```
VITE_BASE_URL=http://localhost:8000
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE -->

## Usage

### AWS S3 Setup

1. Create AWS IAM user with S3 full access
2. Create S3 bucket in your preferred region
3. Store credentials in server .env file

### Gmail App Password

1. Enable 2-Step Verification on Google Account
2. Generate App Password for "Other" application
3. Use generated password in EMAIL_PASSWORD

### Running the Application

Start server:

```
cd server
npm run dev
```

Start client:

```
cd client
npm run dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Add Admin Dashboard
- [ ] Implement Real-time Notifications
- [ ] Add Report Analytics
- [ ] Multi-file Upload Support
- [ ] Social Media Integration

See [open issues](https://github.com/your_username/hackathon-event-reports/issues) for current issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Your Name - [@your_twitter](https://twitter.com/your_handle) - your.email@example.com

Project Link: [https://github.com/your_username/hackathon-event-reports](https://github.com/your_username/hackathon-event-reports)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Multer-S3](https://github.com/badunk/multer-s3)
- [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Express Validator](https://express-validator.github.io/docs/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/your_username/hackathon-event-reports.svg?style=for-the-badge
[contributors-url]: https://github.com/your_username/hackathon-event-reports/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/your_username/hackathon-event-reports.svg?style=for-the-badge
[forks-url]: https://github.com/your_username/hackathon-event-reports/network/members
[stars-shield]: https://img.shields.io/github/stars/your_username/hackathon-event-reports.svg?style=for-the-badge
[stars-url]: https://github.com/your_username/hackathon-event-reports/stargazers
[issues-shield]: https://img.shields.io/github/issues/your_username/hackathon-event-reports.svg?style=for-the-badge
[issues-url]: https://github.com/your_username/hackathon-event-reports/issues
[license-shield]: https://img.shields.io/github/license/your_username/hackathon-event-reports.svg?style=for-the-badge
[license-url]: https://github.com/your_username/hackathon-event-reports/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png

<!-- Tech Stack Shields -->

[MongoDB-shield]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Express-shield]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Express-url]: https://expressjs.com/
[React-shield]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node-shield]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[AWS-shield]: https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white
[AWS-url]: https://aws.amazon.com/
[JWT-shield]: https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens
[JWT-url]: https://jwt.io/

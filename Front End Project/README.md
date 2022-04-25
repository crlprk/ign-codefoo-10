# Setup Guide
## Requirements
This project was bootstrapped using [Create React App](https://github.com/facebook/create-react-app)

* Node.js >=14.0.0
* npm >= 5.6

## Build / Run
### Quickstart
Before building or running the project, a proxy server is required (More information in Details). The project comes with a [temporary server](https://cors-anywhere.herokuapp.com/corsdemo), but can be changed to use any proxy server in **line 28** of [Main.js](https://github.com/crlprk/ign-codefoo-10/blob/master/src/components/Main.js).

In order to access the temporary proxy server, a challenge must be completed on [site](https://cors-anywhere.herokuapp.com/corsdemo).

In order to build the project, clone this repository and from within it:
```sh
npm run build
```
You can now deploy a bundled version of the website to anywhere of your choosing. 


In order to run a development build of the project, clone this repository and from within:
```sh
npm start
```

### Details
The specifications for the design included accessing a provided [API](https://ign-apis.herokuapp.com/) for video data. 

However, due to the api not having a Access-Control-Allow-Origin header, CORS policy causes a failed fetch request without a proxy server of some sort. Due to only developing a front end program and deploying to github pages, a temporary proxy server was used. 

In a real production environment, a self-hosted proxy server or backend server would replace the temporary server in the fetch request or the API server would be reconfigured.

### Demo
For demonstration purposes, a github pages site was set up at [this link](https://crlprk.github.io/ign-codefoo-10/). Completing the challenge at this [site](https://cors-anywhere.herokuapp.com/corsdemo) is necessary before visiting.
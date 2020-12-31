# Vocab - Frontend

This is the frontend component of a basic vocabulary trainer. The focus of this program was not on providing a feature reach vocabulary trainer but to teach myself the development of a cloud native component.
The frontend component is written in Angular. 
The frontend connects to a backend component; the coding for the backend component is available in the repository [RuedigerMueller/vocab_backend](https://github.com/RuedigerMueller/vocab_backend).

## Development server

Run `ng serve` or `npm run start-dev` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` or `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build (`npm run build` always does a production build).

## Running unit tests

Run `ng test` or `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` or `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

You can also use the ready to run Docker Image[ruedigermueller/vocab_frontend](https://hub.docker.com/repository/docker/ruedigermueller/vocab_frontend) to run the application. 

You will have to set the enviroment variable `RUNNING_ON_PLATFORM`to true when running on a platform like Heroku or a Cloud Foundry based environment like SAP Cloud Platform. 
In order to setup the connection to the backend you will have to provide the URL to the backend service via the environment variable `BACKEND_SERVICE_URL`. This is not required in case you are running frontend and backend on a Kubernetes cluster as in such an environment the connection is setup via the .yaml files provide in this repository.

The app is running on [Heroku](https://www.heroku.com/home):
* [Test](https://vocabfetest.herokuapp.com/)
* [Prod](https://vocabfeprod.herokuapp.com/)

It is easy to run the application leveraging [Kubernetes](https://kubernetes.io) locally on Minikube  or in the public cloud on a free account like [Okteto](https://okteto.com/). While I am playing around with the app it e.g. available at [Vocab TS](https://vocab-frontend-ruedigermueller.cloud.okteto.net/). A Cloud Foundry based version is also available on the [SAP Cloud Platform Trial](https://vocab_frontend.cfapps.eu10.hana.ondemand.com). As it is only a trial landscape, the app will be automatically shutdown after some time.
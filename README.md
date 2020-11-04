# Monitoring-terminal-dash
Fast implementation of a monitoring tools using NodeJs based on Terminal capabilities for visualization and interaction. 

* Getting Started
* Improve
* Technology choice
* Difficulties

## Getting Started

This project is fully written in JS it's mandatory to use NodeJS for execution

### Prerequisites

```
npm install
```

### Running the tests

To launch the project use the following command
```
npm start
```
1 - Add website and services to monitor
2 - Start

Hints: 
* to navigate in dashboard use tab to switch between Tables, and arrows for list 

### Mocked services
To start the monitor on predefined values and localhost servers please call :
```
npm run-script example 
```

### Test

I created an End To End test by creating mocked services that turn on and off randomly to generate alerts you can execute it by calling : 
```
npm test
```

## Improve
I can Improve this application design by adding the following:
* Alert using emails, slack ...
* Create client version to monitor inside metrics such as (CPU, RAM, Traffic, ...)
*
But this architecture is not scalable because it's monolithic monitor one the improvement that I thought of is creating a distributed monitoring system using : 
* Watcher services
* Realtime processing using (Brokers, Kafka...)
* Big data storage 
* Client services

## Technology Choice

I choosed NodeJs for multiple reasons such as dynamic language, fast prototyping, non-blocking.
A monitoring tools is very concurrent application so JS is good fit for fast implementation with caution of a whole non-blocking system(DB-writing/reading, Async...) which can cause some harm with all the benefits that comes with.
